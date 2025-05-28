'use client'

import Link from 'next/link'
import { useState } from 'react'
import { exportUsers } from '@/lib/api/users'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'

export default function ExportUsersPage() {
	const params = useParams()
	const locale = params.locale as string
	const t = useTranslations('users.export')
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [success, setSuccess] = useState<string | null>(null)

	const handleExport = async () => {
		try {
			setLoading(true)
			setError(null)
			setSuccess(null)

			await exportUsers()
			setSuccess(t('success'))
		} catch (err: unknown) {
			console.error('Error exporting users:', err)
			setError(t('errors.export'))
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<h1 className="text-2xl font-bold">{t('title')}</h1>
				<Link
					href={`/${locale}/users/list`}
					className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
				>
					{t('back')}
				</Link>
			</div>

			<div className="bg-white dark:bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 mb-4">
				<div className="mb-6">
					<p className="text-gray-700 dark:text-gray-200">
						{t('description')}
					</p>
					<p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
						{t('note')}
					</p>
				</div>

				{error && (
					<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
						{error}
					</div>
				)}

				{success && (
					<div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
						{success}
					</div>
				)}

				<div className="flex items-center justify-between">
					<button
						type="button"
						onClick={handleExport}
						disabled={loading}
						className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
					>
						{loading ? t('button.loading') : t('button.export')}
					</button>
				</div>
			</div>

			<div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
				<h2 className="text-xl font-bold text-gray-600 mb-4">
					{t('info.title')}
				</h2>
				<p className="text-gray-700">
					{t('info.description')}
				</p>
			</div>
		</div>
	)
}
