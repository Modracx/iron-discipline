import type { Metadata } from "next";
import { Barlow, Barlow_Condensed, Saira_Stencil_One } from "next/font/google";
import "./globals.css";

const stencil = Saira_Stencil_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-saira-stencil",
});
const cond = Barlow_Condensed({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-barlow-cond",
});
const barlow = Barlow({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-barlow",
});

export const metadata: Metadata = {
  title: "IRON DISCIPLINE — 7-Day Military Calisthenics",
  description:
    "A brutal, rewarding 7-day military-style calisthenics cycle. Bodyweight only. Proper rest and stretching built in. Every exercise explained.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${stencil.variable} ${cond.variable} ${barlow.variable}`}>
      <body className="min-h-screen antialiased">
        <div className="border-b-2 border-line bg-pit">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-1.5 font-cond text-xs font-semibold tracking-[0.2em] text-drab">
            <span>CONTROLLED DOCUMENT · TC 07-1</span>
            <span className="hidden sm:block">IRON DISCIPLINE · PT PROGRAM</span>
            <span>REV 2026.07</span>
          </div>
        </div>
        {children}
        <footer className="border-t-2 border-line bg-pit">
          <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 font-cond text-sm tracking-wider text-drab sm:flex-row sm:items-center sm:justify-between">
            <p>
              EXERCISE DATA &amp; IMAGES:{" "}
              <a
                href="https://github.com/yuhonas/free-exercise-db"
                className="text-bone underline decoration-ember decoration-2 underline-offset-2 hover:text-ember"
              >
                FREE-EXERCISE-DB
              </a>{" "}
              — PUBLIC DOMAIN
            </p>
            <p>NOT MEDICAL ADVICE. TRAIN HARD. TRAIN SMART.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
