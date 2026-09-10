// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";
import { Session, User } from "next-auth";
import prisma from "@/lib/db"; // استفاده از نمونه استاندارد پریزما
import bcrypt from "bcrypt";

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
    async jwt({ token, user }: { token: JWT; user?: User | any }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).username = token.username;

        const dbUser = await prisma.tb_users.findUnique({
          where: { id: Number(token.id) },
          include: { 
            tb_transactions: { 
              include: { tb_plans: true }, 
              orderBy: { created_at: 'desc' }, 
              take: 1 
            } 
          }
        });

        if (dbUser) {
          (session.user as any).confirm_phone = dbUser.confirm_phone;
          (session.user as any).confirm_email = dbUser.confirm_email;
          (session.user as any).latest_plan = dbUser.tb_transactions[0]?.tb_plans?.name || "رایگان";
        }
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };