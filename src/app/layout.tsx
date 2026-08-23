import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700", "800"],
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
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme') || 'theme-light';
                  var darkThemes = ['theme-dark', 'theme-oled', 'theme-midnight'];
                  var themes = ['theme-light', 'theme-sepia', 'theme-dark', 'theme-oled', 'theme-midnight'];
                  
                  if (theme === 'dark') theme = 'theme-dark';
                  if (theme === 'light') theme = 'theme-light';
                  
                  themes.forEach(function(t) {
                    document.documentElement.classList.remove(t);
                  });
                  
                  document.documentElement.classList.add(theme);
                  
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
      <body className="antialiased font-sans bg-warmbg dark:bg-darkbg text-warmtext dark:text-darktext transition-colors duration-300">
        {children}
      </body>
    </html>
  );
}
