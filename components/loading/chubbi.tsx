import Image from "next/image";

export const ChubbiLoading = () => {
  return (
    <div className="relative h-full w-full">
      <Image
        src="/chubbi.png"
        alt="loader"
        width={250}
        height={250}
        className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 transform brightness-50"
      />
      <div className="flex h-full flex-col items-center justify-center gap-4">
        <div className="opacity-45">
          <div className="flex h-96 w-96 animate-breath items-center justify-center rounded-full bg-fuchsia-800 blur-xl">
            <div className="h-80 w-80 animate-breath rounded-full bg-emerald-800 blur-xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
