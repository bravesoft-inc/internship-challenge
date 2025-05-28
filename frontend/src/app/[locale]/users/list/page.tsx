'use client'

import { fetchUsers } from '@/lib/api/users'
import type { User } from '@/lib/api/users'
import Link from 'next/link'
import { Fragment, useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'

export default function UserListPage() {
	const t = useTranslations('users.list')
	const params = useParams()
	const locale = params.locale as string

	const [users, setUsers] = useState<User[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	const [currentPage, setCurrentPage] = useState(1)
	const [itemsPerPage, setItemsPerPage] = useState(10)

	useEffect(() => {
		const loadUsers = async () => {
			try {
				setLoading(true)
				const data = await fetchUsers()
				console.log('API response:', data)
				setUsers(data.users || [])
				setError(null)
			} catch (err) {
				setError(t('errors.fetch'))
				console.error(err)
			} finally {
				setLoading(false)
			}
		}

		loadUsers()
	}, [])

	const indexOfLastItem = currentPage * itemsPerPage
	const indexOfFirstItem = indexOfLastItem - itemsPerPage
	const currentItems = users.slice(indexOfFirstItem, indexOfLastItem)

	const totalPages = Math.ceil(users.length / itemsPerPage)

	const handlePageChange = (pageNumber: number) => {
		setCurrentPage(pageNumber)
		setTimeout(() => {
			window.scrollTo({ top: 0, behavior: 'smooth' })
		}, 100)
	}

	if (loading) {
		return <div className="text-center py-10">{t('loading')}</div>
	}

	if (error) {
		return <div className="text-center py-10 text-red-500">{error}</div>
	}

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<h1 className="text-2xl font-bold">{t('title')}</h1>
				<Link
					href={`/${locale}/users/add`}
					className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
				>
					{t('addUser')}
				</Link>
			</div>

			<div className="overflow-x-auto">
				<table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
					<thead className="bg-gray-100 dark:bg-gray-700">
						<tr>
							<th className="py-2 px-4 border-b dark:border-gray-600 text-left text-gray-700 dark:text-gray-200">
								{t('table.id')}
							</th>
							<th className="py-2 px-4 border-b dark:border-gray-600 text-left text-gray-700 dark:text-gray-200">
								{t('table.name')}
							</th>
							<th className="py-2 px-4 border-b dark:border-gray-600 text-left text-gray-700 dark:text-gray-200">
								{t('table.email')}
							</th>
							<th className="py-2 px-4 border-b dark:border-gray-600 text-left text-gray-700 dark:text-gray-200">
								{t('table.phone')}
							</th>
							<th className="py-2 px-4 border-b dark:border-gray-600 text-left text-gray-700 dark:text-gray-200">
								{t('table.status')}
							</th>
							<th className="py-2 px-4 border-b dark:border-gray-600 text-left text-gray-700 dark:text-gray-200">
								{t('table.actions')}
							</th>
						</tr>
					</thead>
					<tbody>
						{currentItems.length > 0 ? (
							currentItems.map((user) => (
								<tr
									key={user.id}
									className="hover:bg-gray-50 dark:hover:bg-gray-700"
								>
									<td className="py-2 px-4 border-b dark:border-gray-600 text-gray-900 dark:text-gray-100">
										{user.id}
									</td>
									<td className="py-2 px-4 border-b dark:border-gray-600 text-gray-900 dark:text-gray-100">
										{user.name}
									</td>
									<td className="py-2 px-4 border-b dark:border-gray-600 text-gray-900 dark:text-gray-100">
										{user.email}
									</td>
									<td className="py-2 px-4 border-b dark:border-gray-600 text-gray-900 dark:text-gray-100">
										{user.phone_number || '-'}
									</td>
									<td className="py-2 px-4 border-b dark:border-gray-600 text-gray-900 dark:text-gray-100">
										{user.membership_status || '-'}
									</td>
									<td className="py-2 px-4 border-b dark:border-gray-600 space-x-2">
										<Link
											href={`/${locale}/users/detail/${user.id}`}
											className="text-blue-500 hover:underline dark:text-blue-400"
										>
											{t('actions.detail')}
										</Link>
										<Link
											href={`/${locale}/users/edit/${user.id}`}
											className="text-green-500 hover:underline dark:text-green-400"
										>
											{t('actions.edit')}
										</Link>
										<Link
											href={`/${locale}/users/delete/${user.id}`}
											className="text-red-500 hover:underline dark:text-red-400"
										>
											{t('actions.delete')}
										</Link>
									</td>
								</tr>
							))
						) : (
							<tr>
								<td
									colSpan={6}
									className="py-4 text-center text-gray-700 dark:text-gray-200"
								>
									{t('noUsers')}
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>

			<div className="flex justify-center mt-4">
				<nav aria-label={t('pagination.label')}>
					<ul className="flex space-x-1">
						{currentPage > 1 && (
							<li>
								<button
									type="button"
									onClick={() => handlePageChange(1)}
									className="px-3 py-1 border dark:border-gray-600 bg-white dark:bg-gray-800 text-blue-500 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700"
									aria-label={t('pagination.first')}
								>
									&laquo;
								</button>
							</li>
						)}

						{currentPage > 1 && (
							<li>
								<button
									type="button"
									onClick={() => handlePageChange(currentPage - 1)}
									className="px-3 py-1 border dark:border-gray-600 bg-white dark:bg-gray-800 text-blue-500 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700"
									aria-label={t('pagination.previous')}
								>
									&lsaquo;
								</button>
							</li>
						)}

						{Array.from({ length: totalPages }, (_, i) => i + 1)
							.filter((page) => {
								return (
									page === 1 ||
									page === totalPages ||
									(page >= currentPage - 2 && page <= currentPage + 2)
								)
							})
							.map((page, index, array) => {
								const prevPage = array[index - 1]
								const showEllipsisBefore = index > 0 && prevPage !== page - 1

								return (
									<Fragment key={page}>
										{showEllipsisBefore && (
											<li>
												<span className="px-3 py-1 border dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
													...
												</span>
											</li>
										)}
										<li>
											<button
												type="button"
												onClick={() => handlePageChange(page)}
												className={`px-3 py-1 border dark:border-gray-600 ${
													currentPage === page
														? 'bg-blue-500 text-white dark:bg-blue-600'
														: 'bg-white dark:bg-gray-800 text-blue-500 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700'
												}`}
											>
												{page}
											</button>
										</li>
									</Fragment>
								)
							})}

						{currentPage < totalPages && (
							<li>
								<button
									type="button"
									onClick={() => handlePageChange(currentPage + 1)}
									className="px-3 py-1 border dark:border-gray-600 bg-white dark:bg-gray-800 text-blue-500 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700"
									aria-label={t('pagination.next')}
								>
									&rsaquo;
								</button>
							</li>
						)}

						{currentPage < totalPages && (
							<li>
								<button
									type="button"
									onClick={() => handlePageChange(totalPages)}
									className="px-3 py-1 border dark:border-gray-600 bg-white dark:bg-gray-800 text-blue-500 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700"
									aria-label={t('pagination.last')}
								>
									&raquo;
								</button>
							</li>
						)}
					</ul>
				</nav>
			</div>

			<div className="text-sm text-gray-500 dark:text-gray-300 mt-4">
				{t('pagination.info', {
					total: users.length,
					start: indexOfFirstItem + 1,
					end: indexOfLastItem > users.length ? users.length : indexOfLastItem,
				})}
			</div>
		</div>
	)
}
