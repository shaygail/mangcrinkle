/**
 * Generate CMS_ADMIN_PASSWORD_HASH for .env.local / Vercel.
 *
 * Usage:
 *   npm run cms:hash-password -- "your-strong-password"
 */
import bcrypt from "bcryptjs";

async function main() {
  const password = process.argv[2];
  if (!password || password.length < 8) {
    console.error("Pass a password of at least 8 characters.");
    process.exit(1);
  }
  const hash = await bcrypt.hash(password, 12);
  console.log(hash);
}

main();
