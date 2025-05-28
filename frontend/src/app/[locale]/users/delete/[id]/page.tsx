'use client'

import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { type User, deleteUser, fetchUser } from '@/lib/api/users'
import { useTranslations } from 'next-intl'

export default function DeleteUserPage() {
	const params = useParams()
	const router = useRouter()
	const locale = params.locale as string
	const userId = Number(params.id)
	const t = useTranslations('users.delete')

	const [user, setUser] = useState<User | null>(null)
	const [loading, setLoading] = useState(true)
	const [deleting, setDeleting] = useState(false)
	const [deleteSuccess, setDeleteSuccess] = useState(false)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const loadUser = async () => {
			try {
				setLoading(true)
				const userData = await fetchUser(userId)
				setUser(userData)
				setError(null)
			} catch (err) {
				setError(t('errors.fetch'))
				console.error(err)
			} finally {
				setLoading(false)
			}
		}

		if (userId) {
			loadUser()
		}
	}, [userId, t])

	const handleDelete = async () => {
		try {
			setDeleting(true)
			await deleteUser(userId)

			setDeleting(false)
			setDeleteSuccess(true)
			setError(null)
		} catch (err) {
			setError(t('errors.general'))
			console.error(err)
			setDeleting(false)
		}
	}

	if (loading) {
		return <div className="text-center py-10">{t('loading')}</div>
	}

	if (error) {
		return <div className="text-center py-10 text-red-500">{error}</div>
	}

	if (!user) {
		return <div className="text-center py-10">{t('notFound')}</div>
	}

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<h1 className="text-2xl font-bold">{t('title')}</h1>
				<Link
					href={`/${locale}/users/list`}
					className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
				>
					{t('backToList')}
				</Link>
			</div>

			<div className="bg-red-50 border border-red-200 rounded-lg p-6">
				<h2 className="text-xl font-bold text-red-600 mb-4">{t('confirm.title')}</h2>
				<p className="mb-4">
					{t('confirm.description')}
				</p>

				<div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
					<div className="px-4 py-5 sm:px-6">
						<h3 className="text-lg leading-6 font-medium text-gray-900">
							{user.name}
						</h3>
						<p className="mt-1 max-w-2xl text-sm text-gray-500">
							{t('confirm.id', { id: user.id })}
						</p>
					</div>
					<div className="border-t border-gray-200">
						<dl>
							<div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
								<dt className="text-sm font-medium text-gray-500">
									{t('confirm.email')}
								</dt>
								<dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
									{user.email}
								</dd>
							</div>
							<div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
								<dt className="text-sm font-medium text-gray-500">{t('confirm.phone')}</dt>
								<dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
									{user.phone_number || '-'}
								</dd>
							</div>
						</dl>
					</div>
				</div>

				<div className="flex space-x-4">
					<button
						type="button"
						onClick={handleDelete}
						disabled={deleting}
						className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
					>
						{deleting ? t('submit.loading') : t('submit.label')}
					</button>
					<Link
						href={`/${locale}/users/detail/${userId}`}
						className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
					>
						{t('cancel')}
					</Link>
				</div>
			</div>

			{deleteSuccess && (
				<div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
					{t('success')}
				</div>
			)}
		</div>
	)
}
