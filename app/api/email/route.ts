import sendgrid from "@sendgrid/mail";
sendgrid.setApiKey(process.env.SENDGRID_API_KEY ?? "");

export async function GET() {
  try {
    await sendgrid.send({
      to: "singhankit8066@gmail.com", // Your email where you'll receive emails
      from: "hello@falconai.in", // your website email address here
      subject: `Test Email`,
      html: `<div>You've got a mail</div>`,
    });
  } catch (e) {
    console.log(e);
  }

  console.log("Email sent");
}
