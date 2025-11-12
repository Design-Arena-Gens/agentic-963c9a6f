export const metadata = {
  title: "Luxury Travel Social Agent",
  description: "Generate high-end travel captions and content across platforms"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="container">
          <header className="header">
            <div className="brand">LuxeVoyage Agent</div>
            <nav style={{display:'flex', gap:12}}>
              <a href="https://vercel.com" target="_blank" rel="noreferrer" className="badge">Deployed on Vercel</a>
            </nav>
          </header>
          {children}
          <footer className="footer">? {new Date().getFullYear()} LuxeVoyage Agent ? Crafted for luxury storytellers</footer>
        </div>
      </body>
    </html>
  );
}
