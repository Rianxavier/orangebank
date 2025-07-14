import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-muted">
      <nav className="bg-background border-b p-4 flex gap-4">
        <Link to="/" className="text-primary hover:underline">
          Início
        </Link>
        <Link to="/about" className="text-primary hover:underline">
          Sobre
        </Link>
      </nav>
      <main className="p-4">{children}</main>
    </div>
  );
}
