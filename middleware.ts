export { default } from "next-auth/middleware";
export const config = {
  matcher: ["/NextAuth/Protected/:path*"],
};
