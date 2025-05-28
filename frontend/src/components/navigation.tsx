'use client'

import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'

interface NavigationProps {
	locale: string
}

export function Navigation({ locale }: NavigationProps) {
	const router = useRouter()
	const t = useTranslations('navigation')

	const handleNavigation = (path: string) => {
		router.push(path)
	}

	return (
		<ul className="flex space-x-4">
			<li>
				<button
					type="button"
					onClick={() => handleNavigation(`/${locale}`)}
					className="hover:underline"
				>
					{t('home')}
				</button>
			</li>
			<li>
				<button
					type="button"
					onClick={() => handleNavigation(`/${locale}/users/list`)}
					className="hover:underline"
				>
					{t('userList')}
				</button>
			</li>
			<li>
				<button
					type="button"
					onClick={() => handleNavigation(`/${locale}/users/add`)}
					className="hover:underline"
				>
					{t('addUser')}
				</button>
			</li>
			<li>
				<button
					type="button"
					onClick={() => handleNavigation(`/${locale}/users/import`)}
					className="hover:underline"
				>
					{t('importCsv')}
				</button>
			</li>
			<li>
				<button
					type="button"
					onClick={() => handleNavigation(`/${locale}/users/export`)}
					className="hover:underline"
				>
					{t('exportCsv')}
				</button>
			</li>
		</ul>
	)
}
