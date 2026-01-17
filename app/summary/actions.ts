'use server'

import { auth } from "@/app/auth";
import { db } from "@/lib/db";
import { headers } from "next/headers";

export type PushupSession = {
    id: number;
    count: number;
    duration: number;
    created_at: Date;
    dateStr: string;
}

export type DailyStat = {
    date: string; // YYYY-MM-DD
    totalCount: number;
    sessions: PushupSession[];
}

export async function getMonthlyPushups(year: number, month: number) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        throw new Error("Unauthorized");
    }

    // month is 1-12
    const [rows] = await db.query<any[]>(
        `SELECT id, count, duration, created_at, DATE_FORMAT(created_at, '%Y-%m-%d') as date_str
         FROM pushup_sessions 
         WHERE user_id = ? 
         AND YEAR(created_at) = ? 
         AND MONTH(created_at) = ?
         ORDER BY created_at DESC`,
        [session.user.id, year, month]
    );

    const stats: Record<string, DailyStat> = {};

    rows.forEach((row) => {
        const dateStr = row.date_str;
        if (!stats[dateStr]) {
            stats[dateStr] = {
                date: dateStr,
                totalCount: 0,
                sessions: []
            };
        }
        stats[dateStr].totalCount += row.count;
        stats[dateStr].sessions.push({
            id: row.id,
            count: row.count,
            duration: row.duration,
            created_at: row.created_at,
            dateStr: row.date_str
        });
    });

    return stats;
}

export async function getYearlyPushups(year: number) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        throw new Error("Unauthorized");
    }

    const [rows] = await db.query<any[]>(
        `SELECT count, DATE_FORMAT(created_at, '%Y-%m-%d') as date_str
         FROM pushup_sessions 
         WHERE user_id = ? 
         AND YEAR(created_at) = ?`,
        [session.user.id, year]
    );

    const stats: Record<string, number> = {};

    rows.forEach((row) => {
        const dateStr = row.date_str;
        if (!stats[dateStr]) {
            stats[dateStr] = 0;
        }
        stats[dateStr] += row.count;
    });

    return stats;
}

export async function getRecentPushups(days: number = 30) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        throw new Error("Unauthorized");
    }

    // Calculate start date (inclusive of today)
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    
    const startDate = new Date(today);
    startDate.setUTCDate(today.getUTCDate() - (days - 1));

    const [rows] = await db.query<any[]>(
        `SELECT count, DATE_FORMAT(created_at, '%Y-%m-%d') as date_str
         FROM pushup_sessions 
         WHERE user_id = ? 
         AND created_at >= ?
         ORDER BY created_at ASC`,
        [session.user.id, startDate]
    );

    const stats: Record<string, number> = {};
    rows.forEach((row) => {
        const dateStr = row.date_str;
        if (!stats[dateStr]) {
            stats[dateStr] = 0;
        }
        stats[dateStr] += row.count;
    });

    const results = [];
    for (let i = 0; i < days; i++) {
        const d = new Date(startDate);
        d.setUTCDate(startDate.getUTCDate() + i);
        const dateStr = d.toISOString().split('T')[0];

        results.push({
            date: dateStr,
            count: stats[dateStr] || 0
        });
    }

    return results;
}
        
        
