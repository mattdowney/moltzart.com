import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

const ALLOWED_EMAIL = "matt@mattdowney.com";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  callbacks: {
    async signIn({ profile }) {
      return profile?.email === ALLOWED_EMAIL;
    },
  },
  pages: {
    error: "/admin",
  },
});
