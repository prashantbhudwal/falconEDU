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
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className="mx-auto my-[40px] w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]">
            <Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">
              Your teacher is inviting you to join their class on FalconAI.
            </Heading>
            <Section className="mb-[32px] mt-[32px] text-center">
              <Button
                style={{ padding: "1rem" }}
                className="rounded bg-[#000000] text-center text-[12px] font-semibold text-white no-underline"
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
