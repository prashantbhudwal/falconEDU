import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

const GOOGLE_FORM_URL = "https://forms.gle/ZBQAs2XoZoze7aDc6";

const AccessRequestForm = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background p-4 custom-scrollbar">
      <div className="max-w-lg w-full bg-foreground shadow-md rounded px-8 pt-6 pb-8 mb-4">
        {/* Hero Image */}
        <h1 className="block text-2xl font-bold mb-4 text-card">
          Request Access & Clone Yourself
        </h1>
        <div className="mb-4">
          <Image
            src="/clone.png"
            alt="Hero Image"
            width={200}
            height={200}
            layout="responsive"
            className="rounded-lg"
          />
        </div>

        <p className="text-base font-semibold mb-4">
          You do not have access to this FalconAI Teacher Cloner. Please request
          access by clicking the button below.
        </p>
        <div className="flex items-center justify-between">
          <Link href={GOOGLE_FORM_URL} passHref>
            <Button variant="default" rel="noopener noreferrer" size={"lg"}>
              Request Access
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AccessRequestForm;
