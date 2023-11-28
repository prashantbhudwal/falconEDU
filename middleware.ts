export { default } from "next-auth/middleware";
export const config = {
  matcher: [
    "/preferences/:path*",
    "/magic/:path*",
    "/merlin/:path*",
    "/chubbi/:path*",
    "/dragon/teacher/:path*",
    "/dragon/student/:path*",
  ],
};
