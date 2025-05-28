'use client'

import { type User, fetchUser } from '@/lib/api/users'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'

export default function UserDetailPage() {
	const params = useParams()
	const router = useRouter()
	const locale = params.locale as string
	const userId = Number(params.id)
	const t = useTranslations('users.detail')

	const [user, setUser] = useState<User | null>(null)
	const [loading, setLoading] = useState(true)
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

	const MembershipStatusChip = () => {
		return (
			<span className="px-2 py-1 text-xs rounded-full bg-gray-200 text-gray-700">
				{t('membershipStatus.unknown')}
			</span>
		)
	}

	if (loading) {
		return <div className="text-center py-10">{t('loading')}</div>
	}

	if (error || !user) {
		return (
			<div className="text-center py-10 text-red-500">
				{error || t('notFound')}
			</div>
		)
	}

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<h1 className="text-2xl font-bold">{t('title')}</h1>
				<div className="space-x-2">
					<Link
						href={`/${locale}/users/edit/${user.id}`}
						className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
					>
						{t('actions.edit')}
					</Link>
					<Link
						href={`/${locale}/users/delete/${user.id}`}
						className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
					>
						{t('actions.delete')}
					</Link>
					<Link
						href={`/${locale}/users/list`}
						className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
					>
						{t('actions.backToList')}
					</Link>
				</div>
			</div>

			<div className="bg-white shadow overflow-hidden sm:rounded-lg">
				<div className="px-4 py-5 sm:px-6">
					<h3 className="text-lg leading-6 font-medium text-gray-900">
						{user.name}
					</h3>
					<p className="mt-1 max-w-2xl text-sm text-gray-500">{t('id', { id: user.id })}</p>
				</div>
				<div className="border-t border-gray-200">
					<dl>
						<div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
							<dt className="text-sm font-medium text-gray-500">{t('fields.name')}</dt>
							<dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
								{user.name}
							</dd>
						</div>
						<div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
							<dt className="text-sm font-medium text-gray-500">
								{t('fields.email')}
							</dt>
							<dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
								{user.email}
							</dd>
						</div>
						<div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
							<dt className="text-sm font-medium text-gray-500">{t('fields.phone')}</dt>
							<dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
								{user.phone_number || '-'}
							</dd>
						</div>
						<div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
							<dt className="text-sm font-medium text-gray-500">{t('fields.address')}</dt>
							<dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
								{user.address || '-'}
							</dd>
						</div>
						<div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
							<dt className="text-sm font-medium text-gray-500">{t('fields.birthDate')}</dt>
							<dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
								{user.birth_date || '-'}
							</dd>
						</div>
						<div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
							<dt className="text-sm font-medium text-gray-500">{t('fields.gender')}</dt>
							<dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
								{user.gender || '-'}
							</dd>
						</div>
						<div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
							<dt className="text-sm font-medium text-gray-500">{t('fields.membershipStatus')}</dt>
							<dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
								<MembershipStatusChip/>
							</dd>
						</div>
						<div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
							<dt className="text-sm font-medium text-gray-500">{t('fields.points')}</dt>
							<dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
								{user.points || 0}
							</dd>
						</div>
						<div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
							<dt className="text-sm font-medium text-gray-500">
								{t('fields.lastLogin')}
							</dt>
							<dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
								{user.last_login_at || '-'}
							</dd>
						</div>
						<div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
							<dt className="text-sm font-medium text-gray-500">{t('fields.notes')}</dt>
							<dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
								<div id="notes-container">{user.notes || '-'}</div>
							</dd>
						</div>
					</dl>
				</div>
			</div>
		</div>
	)
}
