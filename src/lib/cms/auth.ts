import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { z } from "zod";

const SESSION_COOKIE = "mang_cms_session";
const SESSION_TTL_SECONDS = 60 * 60 * 12; // 12 hours

export type CmsSession = {
  email: string;
  name: string;
};

function getSecret(): Uint8Array {
  const secret =
    process.env.CMS_AUTH_SECRET ?? process.env.CMS_SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "CMS_AUTH_SECRET must be set to a random string of at least 32 characters."
    );
  }
  return new TextEncoder().encode(secret);
}

function authConfigured(): boolean {
  return Boolean(
    process.env.CMS_ADMIN_EMAIL &&
      process.env.CMS_ADMIN_PASSWORD_HASH &&
      (process.env.CMS_AUTH_SECRET ?? process.env.CMS_SESSION_SECRET)
  );
}

export function isCmsAuthConfigured(): boolean {
  try {
    return authConfigured();
  } catch {
    return false;
  }
}

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(200),
});

export async function verifyAdminCredentials(
  email: string,
  password: string
): Promise<CmsSession | null> {
  if (!authConfigured()) return null;

  const expectedEmail = process.env.CMS_ADMIN_EMAIL!.trim().toLowerCase();
  const hash = process.env.CMS_ADMIN_PASSWORD_HASH!;
  const normalized = email.trim().toLowerCase();

  if (normalized !== expectedEmail) return null;

  const ok = await bcrypt.compare(password, hash);
  if (!ok) return null;

  return {
    email: expectedEmail,
    name: process.env.CMS_ADMIN_NAME?.trim() || "Mang Crinkle Admin",
  };
}

export async function createSession(session: CmsSession): Promise<void> {
  const token = await new SignJWT({
    email: session.email,
    name: session.name,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(getSecret());

  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function destroySession(): Promise<void> {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export async function getSession(): Promise<CmsSession | null> {
  if (!isCmsAuthConfigured()) return null;

  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecret());
    const email = String(payload.email ?? "");
    const name = String(payload.name ?? "Admin");
    if (!email) return null;
    return { email, name };
  } catch {
    return null;
  }
}

export async function requireSession(): Promise<CmsSession> {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  return session;
}

export function parseLoginForm(form: FormData) {
  return loginSchema.safeParse({
    email: form.get("email"),
    password: form.get("password"),
  });
}

/**
 * Helper for generating CMS_ADMIN_PASSWORD_HASH locally:
 *   npx tsx -e "import bcrypt from 'bcryptjs'; console.log(await bcrypt.hash('your-password', 12))"
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}
