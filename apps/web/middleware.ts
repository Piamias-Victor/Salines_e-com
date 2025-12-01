import { auth } from "@/lib/auth/auth"
export { auth as middleware }

export const config = {
    matcher: ["/dashboard/:path*"],
}
