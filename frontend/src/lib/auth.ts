import { DefaultSession, NextAuthOptions, getServerSession } from "next-auth";
import { prisma } from "./db";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      name: string;
      email: string;
      address: any;
      credits: number;
      image: any;
      emailVerified: any;
      tokenProfileId: number;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    name: string;
    email: string;
    address: any;
    image: any;
    credits: number;
    emailVerified: any;
    tokenProfileId: number;
  }
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt: async ({ token }) => {
      // console.log("jwt callback", token);
      const db_user = await prisma.user.findFirst({
        where: {
          email: token.email,
        },
      });
      // console.log(db_user, "db_user");
      if (db_user) {
        token.id = db_user.id;
        token.address = db_user.address;
        token.credits = db_user.credits;
        token.id = db_user.id;
        token.emailVerified = db_user.emailVerified;
        token.credits = db_user.credits;
        token.address = db_user.address;
        token.tokenProfileId = db_user.tokenProfileId || 0;
      }

      return token;
    },
    session: ({ session, token }) => {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
        session.user.emailVerified = token.emailVerified;
        session.user.credits = token.credits;
        session.user.address = token.address;
        session.user.tokenProfileId = token.tokenProfileId;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET as string,
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
};

export const getAuthSession = () => {
  return getServerSession(authOptions);
};
