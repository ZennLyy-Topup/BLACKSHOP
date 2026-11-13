import type { NextAuthOptions, Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "./db";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: { email: {}, password: {} },
      async authorize(creds) {
        if (!creds?.email || !creds?.password) return null;
        const user = await db.user.findUnique({ where: { email: creds.email } });
        if (user && (await bcrypt.compare(creds.password, user.password)))
          return { id: String(user.id), name: user.name, email: user.email, role: user.role } as any;
        return null;
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }: any) { if (user) token.role = user.role; return token; },
    async session({ session, token }: any) {
      session.user.role = token.role;
      session.user.id = token.sub;
      return session;
    },
  },
  pages: { signIn: "/login" },
};

import { getServerSession } from "next-auth";
export const auth = () => getServerSession(authOptions);
export const requireAdmin = async () => {
  const s = await auth();
  if ((s?.user as any)?.role !== "ADMIN") throw new Error("FORBIDDEN");
  return s;
};