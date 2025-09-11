import type { Metadata } from "next";
import "./globals.css";
import "../styles/animations.css";
import { AuthProvider } from '@/context/AuthContext';

export const metadata: Metadata = {
  title: "EduTime - Gestion d'emplois du temps scolaire",
  description: "Application moderne de gestion d'emplois du temps pour les établissements scolaires",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
