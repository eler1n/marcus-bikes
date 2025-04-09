import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./styles/globals.css";
import { CustomizationProvider } from "./lib/context/CustomizationContext";
import { ThemeProvider } from "./lib/context/ThemeContext";
import Header from "./components/Header";
import { ToastProvider } from "./components/ToastContainer";
import BackToTop from "./components/BackToTop";
import styles from "./styles/layout.module.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Marcus Bikes - Custom Bicycles",
  description: "Build your custom bicycle with Marcus Bikes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `
            // Immediately apply dark mode to prevent flashing
            (function() {
              try {
                var savedTheme = localStorage.getItem('theme');
                if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {
                console.error('Error applying theme:', e);
              }
            })();
          `
        }} />
      </head>
      <body className={`${inter.className} scrollbar-thin`}>
        <ThemeProvider>
          <CustomizationProvider>
            <ToastProvider>
              <div className={styles.wrapper}>
                <Header />
                <main className={styles.main}>
                  {children}
                </main>
                <footer className={styles.footer}>
                  <div className={styles.footerContainer}>
                    <div className={styles.footerText}>
                      <p className={styles.copyright}>© {new Date().getFullYear()} Marcus Bikes. All rights reserved.</p>
                    </div>
                    <div className={styles.footerLinks}>
                      <a href="#" className={styles.footerLink}>Privacy Policy</a>
                      <a href="#" className={styles.footerLink}>Terms of Service</a>
                      <a href="#" className={styles.footerLink}>Contact</a>
                    </div>
                  </div>
                </footer>
                <BackToTop />
              </div>
            </ToastProvider>
          </CustomizationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
