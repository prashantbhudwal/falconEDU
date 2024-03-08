"use server";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { s3 } from "@/lib/aws";
import { nanoid } from "nanoid";
import { getServerSession } from "next-auth";
import sharp from "sharp";

export const uploadToDigitalOcean = async (formData: FormData) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error("No session found");
  }
  const file = formData.get("file") as File;
  const buffer = Buffer.from(await file.arrayBuffer());
  const OptimizedBuffer = await sharp(buffer)
    .webp({ lossless: true })
    .toBuffer();

  const bucket = process.env.DO_SPACES_BUCKET ?? "";

  try {
    const stored = await s3
      .upload({
        Bucket: bucket,
        Key: `uploads/${file.name}-${nanoid()}.webp`,
        Body: OptimizedBuffer,
        ACL: "public-read",
        ContentType: "image/webp",
      })
      .promise();
    return { url: stored.Location, key: stored.Key, bucket: bucket };
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

export const deleteFromDigitalOcean = async ({
  key,
  bucket,
}: {
  key: string;
  bucket: string;
}) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error("No session found");
  }
  const params = {
    Bucket: bucket,
    Key: key,
  };

  try {
    await s3.deleteObject(params).promise();
  } catch (error) {
    throw new Error("Error deleting file from DigitalOcean");
  }
};
