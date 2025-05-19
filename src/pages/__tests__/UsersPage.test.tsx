import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import UsersPage from '../UsersPage';

// On encapsule nos tests dans un bloc `describe` pour organiser
describe('UsersPage', () => {
  it('affiche la page avec le bouton Ajouter', () => {
    render(<UsersPage />);
    
    // Vérifie que le bouton "Ajouter" est présent
    expect(screen.getByText('Ajouter')).toBeInTheDocument();
  });

  it('affiche les en-têtes de colonne du tableau', () => {
    render(<UsersPage />);
    
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Rôle')).toBeInTheDocument();
    expect(screen.getByText('Pays')).toBeInTheDocument();
    expect(screen.getByText('BL')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });
});
