'use server'

import { auth } from "@/app/auth";
import { db } from "@/lib/db";
import { headers } from "next/headers";

export async function savePushupSession(count: number, duration: number) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        throw new Error("Unauthorized");
    }

    await db.query(
        'INSERT INTO pushup_sessions (user_id, count, duration) VALUES (?, ?, ?)',
        [session.user.id, count, duration]
    );

    return { success: true };
}
