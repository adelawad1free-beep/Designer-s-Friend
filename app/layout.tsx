
import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context";

const cairo = Cairo({ subsets: ["latin", "arabic"], weight: ["200", "400", "700", "900"] });

export const metadata: Metadata = {
  title: "صديق المصمم | Designer's Friend - أدوات ذكية للمبدعين",
  description: "مجموعة أدوات مجانية شاملة للمصممين والمطورين: مولد باركود QR، أدوات PDF، ضغط الصور، حاسبة الضريبة، ومطابقة ألوان بانتون.",
  keywords: ["صديق المصمم", "Designer's Friend", "أدوات ويب", "SEO Tools", "QR Generator", "PDF Tools"],
  authors: [{ name: "Adel Awad" }],
  openGraph: {
    title: "صديق المصمم | Designer's Friend",
    description: "أدوات ذكية وسريعة للإبداع الرقمي بدون ذكاء اصطناعي مدفوع.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className="light">
      <body className={`${cairo.className} bg-slate-50 dark:bg-slate-900 transition-colors duration-200`}>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
