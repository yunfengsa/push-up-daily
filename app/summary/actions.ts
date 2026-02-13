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

const BUSINESS_TIMEZONE = "Asia/Shanghai";

type MonthlySessionRow = {
    id: number;
    count: number;
    duration: number;
    created_at: Date;
    date_str: string;
};

type CountByDateRow = {
    count: number;
    date_str: string;
};

export async function getMonthlyPushups(year: number, month: number) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        throw new Error("Unauthorized");
    }

    // month is 1-12
    const rows = await db.query<MonthlySessionRow>(
        `SELECT id, count, duration, created_at, TO_CHAR(created_at AT TIME ZONE 'Asia/Shanghai', 'YYYY-MM-DD') AS date_str
         FROM pushup_sessions 
         WHERE user_id = $1 
         AND EXTRACT(YEAR FROM created_at AT TIME ZONE 'Asia/Shanghai') = $2 
         AND EXTRACT(MONTH FROM created_at AT TIME ZONE 'Asia/Shanghai') = $3
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

    const rows = await db.query<CountByDateRow>(
        `SELECT count, TO_CHAR(created_at AT TIME ZONE 'Asia/Shanghai', 'YYYY-MM-DD') AS date_str
         FROM pushup_sessions 
         WHERE user_id = $1 
         AND EXTRACT(YEAR FROM created_at AT TIME ZONE 'Asia/Shanghai') = $2`,
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
    const todayDateStr = new Intl.DateTimeFormat("en-CA", {
        timeZone: BUSINESS_TIMEZONE
    }).format(new Date());
    const today = new Date(`${todayDateStr}T00:00:00Z`);
    
    const startDate = new Date(today);
    startDate.setUTCDate(today.getUTCDate() - (days - 1));
    const startDateStr = startDate.toISOString().split('T')[0];

    const rows = await db.query<CountByDateRow>(
        `SELECT count, TO_CHAR(created_at AT TIME ZONE 'Asia/Shanghai', 'YYYY-MM-DD') AS date_str
         FROM pushup_sessions 
         WHERE user_id = $1 
         AND (created_at AT TIME ZONE 'Asia/Shanghai')::date >= $2::date
         ORDER BY created_at ASC`,
        [session.user.id, startDateStr]
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
        
        
