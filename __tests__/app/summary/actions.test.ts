import { getYearlyPushups, getRecentPushups } from '@/app/summary/actions';
import { auth } from "@/app/auth";
import { db } from "@/lib/db";
import { headers } from "next/headers";

jest.mock("@/app/auth", () => ({
    auth: {
        api: {
            getSession: jest.fn()
        }
    }
}));

jest.mock("@/lib/db", () => ({
    db: {
        query: jest.fn()
    }
}));

jest.mock("next/headers", () => ({
    headers: jest.fn()
}));

describe('getYearlyPushups', () => {
    it('should return yearly stats correctly aggregated by date', async () => {
        const mockUser = { id: 'user123' };
        (auth.api.getSession as jest.Mock).mockResolvedValue({ user: mockUser });
        
        const mockRows = [
            { date_str: '2026-01-16', count: 10 },
            { date_str: '2026-01-15', count: 20 },
            { date_str: '2026-01-16', count: 5 } // Multiple entries for same day
        ];
        
        (db.query as jest.Mock).mockResolvedValue([mockRows, undefined]);

        const result = await getYearlyPushups(2026);

        expect(db.query).toHaveBeenCalledWith(
            expect.stringContaining('FROM pushup_sessions'),
            expect.arrayContaining([mockUser.id, 2026])
        );

        expect(result).toEqual({
            '2026-01-16': 15, // 10 + 5
            '2026-01-15': 20
        });
    });

    it('should throw error if unauthorized', async () => {
        (auth.api.getSession as jest.Mock).mockResolvedValue(null);

        await expect(getYearlyPushups(2026)).rejects.toThrow("Unauthorized");
    });
});

describe('getRecentPushups', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 30 days of data with missing days filled as 0', async () => {
        const mockUser = { id: 'user123' };
        (auth.api.getSession as jest.Mock).mockResolvedValue({ user: mockUser });

        // Mock DB returning some data
        // Assume today is 2026-01-16. 30 days range.
        const mockRows = [
            { date_str: '2026-01-16', count: 10 },
            { date_str: '2026-01-14', count: 5 }
        ];
        (db.query as jest.Mock).mockResolvedValue([mockRows, undefined]);

        // Fix the system time to ensure stable tests
        // 2026-01-16
        jest.useFakeTimers().setSystemTime(new Date('2026-01-16T12:00:00Z'));

        const result = await getRecentPushups(30);

        expect(result).toHaveLength(30);
        
        // Expect result to be sorted by date ascending usually, or just check specific dates
        // Let's assume we want them sorted ascending (oldest to newest) as that's typical for charts
        
        // Last element = Today (2026-01-16)
        expect(result[29]).toEqual({ date: '2026-01-16', count: 10 });
        
        // Second to last = Yesterday (2026-01-15) - Missing in DB, should be 0
        expect(result[28]).toEqual({ date: '2026-01-15', count: 0 });
        
        // 2026-01-14 - Present in DB
        expect(result[27]).toEqual({ date: '2026-01-14', count: 5 });

        jest.useRealTimers();
    });
});
