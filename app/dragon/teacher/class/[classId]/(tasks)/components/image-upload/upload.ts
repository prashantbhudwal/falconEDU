"use server";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { s3 } from "@/lib/aws";
import { nanoid } from "nanoid";
import { getServerSession } from "next-auth";

export const uploadToDigitalOcean = async (formData: FormData) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error("No session found");
  }
  const file = formData.get("file") as File;
  const buffer = Buffer.from(await file.arrayBuffer());
  const params = {
    Bucket: process.env.DO_SPACES_BUCKET ?? "",
    Key: `uploads/${file.name}-${nanoid()}`,
    Body: buffer,
    ACL: "public-read",
  };
  try {
    const stored = await s3.upload(params).promise();
    return { url: stored.Location, key: stored.Key, bucket: params.Bucket };
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
