import sendgrid from "@sendgrid/mail";
import { NextResponse } from "next/server";
sendgrid.setApiKey(process.env.SENDGRID_API_KEY ?? "");

export async function GET() {
  try {
    await sendgrid.send({
      to: "singhankit8066@gmail.com", // Your email where you'll receive emails
      from: "hello@falconai.in", // your website email address here
      subject: `Test Email`,
      html: `<div>You've got a mail</div>`,
    });
    return new NextResponse("Email sent successfully", { status: 200 });
  } catch (e) {
    console.log(e);
    return new NextResponse("Email not sent", { status: 500 });
  }
}
