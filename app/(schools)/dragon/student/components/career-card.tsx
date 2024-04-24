import Image from "next/image";
import Link from "next/link";

export const CareerCard = () => {
  return (
    <Link href={"/dragon/student/careers"}>
      <div className="max-w-96 p-2">
        <div className="overflow-hidden rounded bg-fuchsia-950 shadow-lg transition-shadow duration-300 ease-in-out hover:shadow-2xl">
          <div className="relative h-32 w-full">
            <Image
              src="/career.webp"
              layout="fill"
              objectFit="cover"
              alt="Career exploration"
              className="transition-opacity duration-300 ease-in-out hover:opacity-75"
            />
          </div>
          <div className="flex flex-col space-y-1 p-3">
            <h3 className="text-sm font-semibold text-slate-200">
              Career Gallery
            </h3>
            <p className="text-xs text-slate-400">
              Discover careers with AI, talk to an astronaut, engineer, or
              artist and find your path.
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};
