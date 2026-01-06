import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ExaminationMenu from './ExaminationMenu';
import { BrowserRouter } from 'react-router-dom';

describe('ExaminationMenu Component', () => {
  it('should render the examination menu', () => {
    render(
      <BrowserRouter>
        <ExaminationMenu />
      </BrowserRouter>
    );
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
  });

  it('should contain examination buttons', () => {
    render(
      <BrowserRouter>
        <ExaminationMenu />
      </BrowserRouter>
    );
    const buttons = screen.getAllByRole('button');
    // Should have back button + multiple examination buttons
    expect(buttons.length).toBeGreaterThan(1);
  });
});
