export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/dashboard/:path*", "/themes/:path*", "/editor/:path*"],
};
