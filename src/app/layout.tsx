import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "studylog - Study Session Tracker",
  description: "Track your study sessions, monitor streak counts, and visualize progress",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme') || 'theme-oled';
                  var darkThemes = ['theme-dark', 'theme-oled', 'theme-midnight'];
                  var themes = ['theme-light', 'theme-sepia', 'theme-dark', 'theme-oled', 'theme-midnight'];
                  
                  if (theme === 'dark') theme = 'theme-dark';
                  if (theme === 'light') theme = 'theme-light';
                  
                  themes.forEach(function(t) {
                    document.documentElement.classList.remove(t);
                  });
                  
                  document.documentElement.classList.add(theme);
                  document.documentElement.setAttribute('data-theme', theme);
                  
                  if (darkThemes.indexOf(theme) > -1) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="antialiased font-sans bg-theme-bg text-theme-text transition-colors duration-200">
        {children}
      </body>
    </html>
  );
}
