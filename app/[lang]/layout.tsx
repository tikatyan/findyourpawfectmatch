import type React from "react"
import { SiteHeader } from "@/components/site-header"
import { getDictionary } from "./dictionaries"
import Link from "next/link"
import { Suspense } from "react"

export const dynamicParams = false

export async function generateStaticParams() {
  return [{ lang: "en" }, { lang: "id" }]
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: "en" | "id" }>
}) {
  const { lang } = await params
  const dict = await getDictionary(lang)

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <SiteHeader lang={lang} dict={dict} />
        {children}
        {/* Global Footer */}
        <footer className="bg-white shadow-inner border-t border-orange-100 mt-12 py-8">
          <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
            <p>
              {dict.footer.made_by_prefix}{" "}
              <Link
                href="https://www.linkedin.com/in/atikasulistyan/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-600 hover:text-orange-700 font-semibold"
              >
                Atika Sulistyan 🙋‍♀️
              </Link>
              .
            </p>
            <p className="mt-2">
              &copy; {new Date().getFullYear()} {dict.footer.all_rights_reserved}
            </p>
          </div>
        </footer>
      </Suspense>
    </>
  )
}
