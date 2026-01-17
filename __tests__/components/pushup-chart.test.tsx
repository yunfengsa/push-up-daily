/** @jest-environment jsdom */
import { render, screen } from '@testing-library/react';
import PushupChart from '@/components/pushup-chart';

// Mock Recharts modules
jest.mock('recharts', () => {
    return {
        ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
            <div data-testid="responsive-container">{children}</div>
        ),
        LineChart: ({ children }: { children: React.ReactNode }) => (
            <div data-testid="line-chart">{children}</div>
        ),
        Line: () => <div data-testid="line" />,
        XAxis: () => <div data-testid="x-axis" />,
        Tooltip: () => <div data-testid="tooltip" />,
    };
});

describe('PushupChart', () => {
    const mockData = [
        { date: '2026-01-01', count: 10 },
        { date: '2026-01-02', count: 20 },
        { date: '2026-01-03', count: 0 },
    ];

    it('renders without crashing', () => {
        render(<PushupChart data={mockData} />);
        expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
        expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    });

    it('renders chart components', () => {
        render(<PushupChart data={mockData} />);
        expect(screen.getByTestId('line')).toBeInTheDocument();
        expect(screen.getByTestId('x-axis')).toBeInTheDocument();
        expect(screen.getByTestId('tooltip')).toBeInTheDocument();
    });
    
    it('handles empty data gracefully', () => {
         render(<PushupChart data={[]} />);
         expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    });
});
