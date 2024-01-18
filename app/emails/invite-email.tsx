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

interface InviteStudentsEmailProps {
  teacherImage?: string;
  invitedByEmail?: string;
  nameOfClass?: string;
  inviteLink?: string;
}

export const InviteStudentsEmail = ({
  teacherImage,
  invitedByEmail,
  nameOfClass,
  inviteLink,
}: InviteStudentsEmailProps) => {
  const previewText = `Your teacher has invited you to join their class on FalconAI.`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[465px]">
            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
              Your teacher is inviting you to join their class on FalconAI.
            </Heading>
            <Section className="text-center mt-[32px] mb-[32px]">
              <Button
                style={{ padding: "1rem" }}
                className="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center"
                href={inviteLink}
              >
                Join the Class
              </Button>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
