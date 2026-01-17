/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Heatmap } from '@/components/heatmap';

describe('Heatmap Component', () => {
  it('renders correct number of days for 2026', () => {
    render(<Heatmap data={{}} year={2026} />);
    const cells = screen.getAllByTestId('heatmap-cell');
    expect(cells.length).toBe(365);
  });

  it('renders correct color for data', () => {
      const data = { '2026-01-01': 50 };
      render(<Heatmap data={data} year={2026} />);
      const cell = screen.getByTitle('2026-01-01: 50 个');
      expect(cell).toBeInTheDocument();
  });

  it('has overflow container for mobile responsiveness', () => {
    render(<Heatmap data={{}} year={2026} />);
    const grid = screen.getByTestId('heatmap-grid');
    const container = grid.parentElement;
    expect(container).toHaveClass('overflow-x-auto');
  });
});