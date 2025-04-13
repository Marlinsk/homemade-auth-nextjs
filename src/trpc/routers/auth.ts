import * as bcryptjs from "bcryptjs";
import { baseProcedure, createTRPCRouter } from '../init';
import { eq } from "drizzle-orm";
import { db } from '@/db';
import { account, session, users } from '@/db/schema';
import { randomUUID } from "crypto";
import { signInSchema, signUpSchema } from "@/schemas/auth";

export const authRouter = createTRPCRouter({
  localSignUp: baseProcedure.input(signUpSchema).mutation(async ({ input }) => {
    const { name, email, password } = input;

    const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existingUser.length > 0) return { error: "Email already exists." };

    const [user] = await db.insert(users).values({ name, email, emailVerified: false }).returning();
    const hashedPassword = await bcryptjs.hash(password, 10);
    
    const [userAccount] = await db.insert(account).values({ 
      accountId: user.id, 
      providerId: "credentials", 
      userId: user.id, 
      password: hashedPassword, 
      accessToken: null,
      refreshToken: null,
      idToken: null,
      accessTokenExpiresAt: null,
      refreshTokenExpiresAt: null,
      scope: null
    }).returning();

    const token = randomUUID();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 1000 * 60 * 60 * 24 * 7); // 7 days

    const [newSession] = await db.insert(session).values({
      token,
      userId: userAccount.userId,
      expiresAt,
      ipAddress: null,
      userAgent: null
    }).returning();

    return newSession;
  }),
  localSignIn: baseProcedure.input(signInSchema).mutation(async ({ input }) => {
    const { email, password } = input;
    
    const now = new Date();

    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (!user) throw new Error("Invalid credentials");

    const [userAccount] = await db.select().from(account).where(eq(account.userId, user.id)).limit(1);
    if (!userAccount || !userAccount.password) throw new Error("Invalid credentials");

    const isValidPassword = await bcryptjs.compare(password, userAccount.password);
    if (!isValidPassword) throw new Error("Invalid credentials");

    const [userSession] = await db.select().from(session).where(eq(session.userId, userAccount.userId)).limit(1);

    if (userSession && userSession.expiresAt > now) {
      return userSession;
    }

    const token = randomUUID();
    const expiresAt = new Date(now.getTime() + 1000 * 60 * 60 * 24 * 7); // 7 days

    const [newSession] = await db.insert(session).values({
      token,
      userId: user.id,
      expiresAt,
      ipAddress: null,
      userAgent: null
    }).returning();

    return newSession;
  })
});