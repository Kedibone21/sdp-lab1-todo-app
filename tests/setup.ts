import { execSync } from "child_process";

process.env.DATABASE_URL = "file:./test.db";

execSync("npx prisma db push --force-reset --skip-generate", {
  stdio: "inherit",
});