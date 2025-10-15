import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, account, profile }: any) {
      if (account && profile) {
        token.email = profile.email;
        token.name = profile.name;
        if ((profile as any).picture) token.picture = (profile as any).picture;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (token) {
        session.user = session.user || {} as any;
        (session.user as any).email = token.email;
        (session.user as any).name = token.name;
        (session.user as any).image = token.picture;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };


