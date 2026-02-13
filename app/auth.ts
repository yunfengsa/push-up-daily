import { betterAuth } from "better-auth";
import { pool } from "@/lib/db";
import { username } from "better-auth/plugins";

export const auth = betterAuth({
  database: pool,
  emailAndPassword: { 
    enabled: true, 
  }, 
  plugins: [
    username()
  ]
});
