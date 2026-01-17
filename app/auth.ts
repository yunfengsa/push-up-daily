import { betterAuth } from "better-auth";
import { db } from "@/lib/db";
import { username } from "better-auth/plugins";

export const auth = betterAuth({
  database: db,
  emailAndPassword: { 
    enabled: true, 
  }, 
  plugins: [
    username()
  ]
});