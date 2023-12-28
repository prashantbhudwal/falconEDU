import {
  Body,
  Button,
  Container,
  Column,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import * as React from "react";

interface FalconAiInviteUserEmailProps {
  teacherImage?: string;
  invitedByEmail?: string;
  nameOfClass?: string;
  inviteLink?: string;
}

const FalconAiInviteUserEmail = ({
  teacherImage,
  invitedByEmail,
  nameOfClass,
  inviteLink,
}: FalconAiInviteUserEmailProps) => {
  const previewText = `Join ${nameOfClass} class on FalconAi`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[465px]">
            <Section className="mt-[32px]">
              <Img
                src={`https://falconai.in/assets/images/image03.png?v=e14dd192`}
                width="40"
                height="37"
                alt="chubbi"
                className="my-0 mx-auto"
              />
            </Section>
            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
              Join <strong>{nameOfClass}</strong> class on{" "}
              <strong>FalconAi</strong>
            </Heading>
            <Text className="text-black text-[14px] leading-[24px]">
              (
              <Link
                href={`mailto:${invitedByEmail}`}
                className="text-blue-600 no-underline"
              >
                {invitedByEmail}
              </Link>
              ) has invited you to join the <strong>{nameOfClass}</strong> class
              on <strong>FalconAi</strong>.
            </Text>
            <Section>
              <Row>
                <Column align="right">
                  <Img
                    className="rounded-full"
                    src={teacherImage}
                    width="64"
                    height="64"
                  />
                </Column>
                <Column align="center">
                  <Text className="text-text-500 text-xl">&gt;</Text>
                </Column>
                <Column align="left">
                  <Img
                    className="rounded-full"
                    src="https://falconai.in/assets/images/image03.png?v=e14dd192"
                    width="64"
                    height="64"
                  />
                </Column>
              </Row>
            </Section>
            <Section className="text-center mt-[32px] mb-[32px]">
              <Button
                style={{ padding: "1rem" }}
                className="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center"
                href={inviteLink}
              >
                Join the Class
              </Button>
            </Section>
            <Text className="text-black text-[14px] leading-[24px]">
              or copy and paste this URL into your browser:{" "}
              <Link href={inviteLink} className="text-blue-600 no-underline">
                {inviteLink}
              </Link>
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default FalconAiInviteUserEmail;
