import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import '@/styles/globals.css'
import Link from 'next/link'
import { NextIntlClientProvider } from 'next-intl'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { locales } from '@/i18n/config'
import { Navigation } from '@/components/navigation'

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
})

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
})

type Props = {
	children: React.ReactNode
	params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const resolvedParams = await params
	const t = await getTranslations('metadata')
	return {
		title: t('title'),
		description: t('description'),
	}
}

export async function generateStaticParams() {
	return locales.map((locale) => ({ locale }))
}

export default async function RootLayout({ children, params }: Props) {
	const resolvedParams = await params
	const locale = resolvedParams.locale

	let messages;
	try {
		messages = (await import(`@/locales/${locale}.json`)).default;
	} catch (error) {
		notFound();
	}

	return (
		<html lang={locale}>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<NextIntlClientProvider locale={locale} messages={messages}>
					<div className="min-h-screen flex flex-col">
						<header className="bg-slate-800 text-white p-4">
							<div className="container mx-auto">
								<h1 className="text-2xl font-bold">{messages.metadata.title}</h1>
								<Navigation locale={locale} />
							</div>
						</header>
						<main className="flex-grow container mx-auto p-4">{children}</main>
						<footer className="bg-slate-800 text-white p-4">
							<div className="container mx-auto text-center">
								<p>{messages.footer.text}</p>
							</div>
						</footer>
					</div>
				</NextIntlClientProvider>
			</body>
		</html>
	)
}
