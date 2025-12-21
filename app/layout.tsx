import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CleanHome Pro - Assistant Ménage",
  description: "Gérez vos 250 tâches de nettoyage avec rappels intelligents",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "CleanHome Pro",
  },
};

export const viewport: Viewport = {
  themeColor: "#3b82f6",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body>
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js', { scope: '/' })
                    .then(function(registration) {
                      console.log('✅ SW enregistré:', registration.scope);
                      
                      // Forcer la mise à jour
                      registration.update();
                      
                      // Écouter les mises à jour
                      registration.addEventListener('updatefound', function() {
                        console.log('🔄 Mise à jour SW disponible');
                        const newWorker = registration.installing;
                        newWorker.addEventListener('statechange', function() {
                          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            console.log('✨ Nouvelle version disponible - Rafraîchir la page');
                          }
                        });
                      });
                    })
                    .catch(function(err) {
                      console.error('❌ Erreur SW:', err);
                    });
                });
              } else {
                console.warn('⚠️ Service Workers non supportés');
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
