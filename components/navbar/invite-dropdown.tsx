//react-share doesn't work in server components while deployment
"use client";
import {
  FaLinkedin,
  FaWhatsapp,
  FaEnvelope,
  FaFacebook,
} from "react-icons/fa6";
import {
  LinkedinShareButton,
  WhatsappShareButton,
  EmailShareButton,
  FacebookShareButton,
} from "react-share";
const share = {
  email: {
    subject: "Falcon AI",
    body: "I invite you to try FalconAI for FREE. It's an AI teaching assistant specially designed for teachers. You can Lesson Plans, Worksheets, Activities and Assessments with AI that is easy to use and strictly follows your syllabus.",
  },
  linkedin: {
    title: "Falcon AI",
    summary:
      "I invite you to try FalconAI for FREE. It's an AI teaching assistant specially designed for teachers. You can Lesson Plans, Worksheets, Activities and Assessments with AI that is easy to use and strictly follows your syllabus.",
  },
  whatsapp: {
    title:
      "Hey, check out FalconAI - AI for teachers.≈ You can Lesson Plans, Worksheets, Activities and Assessments with AI that is easy to use and strictly follows your syllabus. Click the link and try it for FREE.",
  },
  facebook: {
    quote:
      "I invite you to try FalconAI for FREE. It's an AI teaching assistant specially designed for teachers. You can Lesson Plans, Worksheets, Activities and Assessments with AI that is easy to use and strictly follows your syllabus.",
    hashtag: "#falconAi #aiForTeachers #ai #teachers #learning",
  },
};
export default function InviteDropdown() {
  return (
    <div className="dropdown">
      <label
        tabIndex={0}
        className="btn-base-100 btn btn-sm rounded-sm capitalize"
      >
        Invite
      </label>
      <ul
        tabIndex={0}
        className="menu dropdown-content menu-sm z-[1] mt-3 w-40 rounded-box bg-base-100 p-2 shadow"
      >
        <li>
          <div className="flex justify-between gap-2">
            <LinkedinShareButton
              url="https://falconai.in"
              title={share.linkedin.title}
              summary={share.linkedin.summary}
            >
              LinkedIn
            </LinkedinShareButton>
            <FaLinkedin className="text-base text-info" />
          </div>
        </li>
        <li>
          <div className="flex justify-between gap-2">
            <WhatsappShareButton
              url="https://falconai.in"
              title={share.whatsapp.title}
            >
              Whatsapp
            </WhatsappShareButton>
            <FaWhatsapp className="text-base text-success" />
          </div>
        </li>
        {/* <li>
          <div className="flex gap-2 justify-between">
            <EmailShareButton
              onClick={() => {}}
              url="https://falconai.in"
              openShareDialogOnClick={true}
              subject={share.email.subject}
              body={share.email.body}
            >
              Email
            </EmailShareButton>
            <FaEnvelope className="text-error text-base" />
          </div>
        </li> */}
        <li>
          <div className="flex justify-between gap-2">
            <FacebookShareButton
              url="https://falconai.in"
              hashtag={share.facebook.hashtag}
            >
              Facebook
            </FacebookShareButton>
            <FaFacebook className="text-base text-info" />
          </div>
        </li>
      </ul>
    </div>
  );
}
