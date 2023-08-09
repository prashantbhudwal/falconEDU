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
        className="btn btn-base-100 rounded-sm btn-sm capitalize"
      >
        Invite
      </label>
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-40"
      >
        <li>
          <div className="flex gap-2 justify-between">
            <LinkedinShareButton
              url="https://falconai.in"
              title={share.linkedin.title}
              summary={share.linkedin.summary}
            >
              LinkedIn
            </LinkedinShareButton>
            <FaLinkedin className="text-info text-base" />
          </div>
        </li>
        <li>
          <div className="flex gap-2 justify-between">
            <WhatsappShareButton
              url="https://falconai.in"
              title={share.whatsapp.title}
            >
              Whatsapp
            </WhatsappShareButton>
            <FaWhatsapp className="text-success text-base" />
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
          <div className="flex gap-2 justify-between">
            <FacebookShareButton
              url="https://falconai.in"
              quote={share.facebook.quote}
              hashtag={share.facebook.hashtag}
            >
              Facebook
            </FacebookShareButton>
            <FaFacebook className="text-info text-base" />
          </div>
        </li>
      </ul>
    </div>
  );
}
