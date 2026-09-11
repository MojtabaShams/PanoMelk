// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";
import { Session, User } from "next-auth";
import prisma from "@/lib/db"; // استفاده از نمونه استاندارد پریزما
import bcrypt from "bcrypt";

type AuthenticatedUser = User & {
  confirm_phone?: boolean | null;
  confirm_email?: boolean | null;
  latest_plan?: string;
};

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("ایمیل و رمز عبور الزامی است.");
        }

        const user = await prisma.tb_users.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          throw new Error("کاربری با این مشخصات یافت نشد.");
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordValid) {
          throw new Error("رمز عبور اشتباه است.");
        }

        return {
          id: user.id.toString(),
          email: user.email,
          name: user.full_name,
          username: user.username,
          confirm_phone: user.confirm_phone,
          confirm_email: user.confirm_email,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt" as const,
    maxAge: 10 * 60,
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: AuthenticatedUser }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.confirm_phone = user.confirm_phone;
        token.confirm_email = user.confirm_email;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        (session.user as AuthenticatedUser).id = token.id;
        (session.user as AuthenticatedUser).username = token.username;
        (session.user as AuthenticatedUser).confirm_phone = token.confirm_phone;
        (session.user as AuthenticatedUser).confirm_email = token.confirm_email;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };