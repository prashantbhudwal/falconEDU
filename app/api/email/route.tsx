import sendgrid from "@sendgrid/mail";
import { NextResponse } from "next/server";
import FalconAiInviteUserEmail from "../../emails/invite-email";
import { render } from "@react-email/render";
sendgrid.setApiKey(process.env.SENDGRID_API_KEY ?? "");

export async function POST(request: Request) {
  const data = await request.json();
  const emailHtml = render(
    <FalconAiInviteUserEmail
      teacherImage={data.teacherImage}
      invitedByEmail={data.teacherEmail}
      nameOfClass={data.nameOfClass}
      inviteLink={data.inviteLink}
    />
  );
  try {
    await sendgrid.send({
      to: data.studentEmail, // Your email where you'll receive emails
      from: "hello@falconai.in", // your website email address here
      subject: `Invitation`,
      html: emailHtml,
    });
    return new NextResponse("Email sent successfully", { status: 200 });
  } catch (e) {
    console.log(e);
    return new NextResponse("Email not sent", { status: 500 });
  }
}
