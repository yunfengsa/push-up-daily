/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import SummaryPage from '@/app/summary/page';
import { getMonthlyPushups, getYearlyPushups, getRecentPushups } from '@/app/summary/actions';

// Mock server actions
jest.mock('@/app/summary/actions', () => ({
    getMonthlyPushups: jest.fn(),
    getYearlyPushups: jest.fn(),
    getRecentPushups: jest.fn(),
}));

// Mock next/link
jest.mock('next/link', () => {
    return ({ children }: { children: React.ReactNode }) => {
        return children;
    }
});

describe('SummaryPage', () => {
    beforeEach(() => {
        (getMonthlyPushups as jest.Mock).mockResolvedValue({});
        (getYearlyPushups as jest.Mock).mockResolvedValue({});
        (getRecentPushups as jest.Mock).mockResolvedValue([]);
    });

    it('renders summary page with heatmap and trend chart', async () => {
        render(<SummaryPage />);
        
        await waitFor(() => {
            expect(screen.getByText('年度热力图')).toBeInTheDocument();
            expect(screen.getByText('最近30天趋势')).toBeInTheDocument();
        });
        
        expect(getMonthlyPushups).toHaveBeenCalled();
        expect(getYearlyPushups).toHaveBeenCalled();
        expect(getRecentPushups).toHaveBeenCalled();
    });
});
