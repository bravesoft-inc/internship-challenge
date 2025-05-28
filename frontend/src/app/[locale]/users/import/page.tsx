'use client'

import Link from 'next/link'
import { useState } from 'react'
import { importUsers } from '@/lib/api/users'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'

interface ColumnInfo {
	name: string
	description: string
	required: string
}

export default function ImportUsersPage() {
	const params = useParams()
	const locale = params.locale as string
	const t = useTranslations('users.import')
	const [file, setFile] = useState<File | null>(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [success, setSuccess] = useState<string | null>(null)

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			setFile(e.target.files[0])
			setError(null)
		}
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		if (!file) {
			setError(t('errors.noFile'))
			return
		}

		if (!file.name.endsWith('.csv')) {
			setError(t('errors.notCsv'))
			return
		}

		try {
			setLoading(true)
			setError(null)
			setSuccess(null)

			const result = await importUsers(file)
			setSuccess(result.message || t('success'))
			setFile(null)

			const fileInput = document.getElementById('csv_file') as HTMLInputElement
			if (fileInput) {
				fileInput.value = ''
			}
		} catch (err: unknown) {
			console.error('Error importing users:', err)
			if (err instanceof Error) {
				setError(err.message)
			} else {
				setError(t('errors.unknown'))
			}
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

			<div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
				<div className="mb-6">
					<p className="text-gray-700">
						{t('description')}
					</p>
					<p className="text-gray-500 text-sm mt-2">
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

				<form onSubmit={handleSubmit}>
					<div className="mb-4">
						<label
							className="block text-gray-700 text-sm font-bold mb-2"
							htmlFor="csv_file"
						>
							{t('form.file')}
						</label>
						<input
							className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
							id="csv_file"
							type="file"
							accept=".csv"
							onChange={handleFileChange}
							placeholder={t('form.filePlaceholder')}
						/>
					</div>

					<div className="flex items-center justify-between">
						<button
							className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
							type="submit"
							disabled={loading || !file}
						>
							{loading ? t('form.loading') : t('form.submit')}
						</button>
					</div>
				</form>
			</div>

			<div className="bg-white border border-yellow-200 rounded-lg p-6">
				<h2 className="text-xl font-bold text-yellow-600 mb-4">
					{t('format.title')}
				</h2>
				<p className="mb-4">
					{t('format.description')}
				</p>

				<div className="overflow-x-auto">
					<table className="min-w-full bg-white border border-gray-200">
						<thead className="bg-gray-100">
							<tr>
								<th className="py-2 px-4 border-b text-left">{t('format.table.column')}</th>
								<th className="py-2 px-4 border-b text-left">{t('format.table.description')}</th>
								<th className="py-2 px-4 border-b text-left">{t('format.table.required')}</th>
							</tr>
						</thead>
						<tbody>
							{Object.entries(t.raw('format.columns') as Record<string, ColumnInfo>).map(([key, value]) => (
								<tr key={key}>
									<td className="py-2 px-4 border-b">{value.name}</td>
									<td className="py-2 px-4 border-b">{value.description}</td>
									<td className="py-2 px-4 border-b">{value.required}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	)
}
