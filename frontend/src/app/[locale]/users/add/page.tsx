'use client'

import type { AxiosError } from 'axios'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import { useState } from 'react'
import { type User, createUser } from '@/lib/api/users'
import { useTranslations } from 'next-intl'

export default function AddUserPage() {
	const t = useTranslations('users.add')
	const router = useRouter()
	const params = useParams()
	const locale = params.locale as string

	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [serverErrors, setServerErrors] = useState<Record<string, string[]>>({})

	const [formData, setFormData] = useState({
		name: '',
		email: '',
		phone_number: '',
		address: '',
		birth_date: '',
		gender: '',
		membership_status: 'pending',
		notes: '',
		points: '0',
	})

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>,
	) => {
		const { name, value } = e.target
		setFormData((prev) => ({ ...prev, [name]: value }))
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		if (!formData.name) {
			setError(t('form.name.required'))
			return
		}

		try {
			setLoading(true)
			setError(null)
			setServerErrors({})

			const userData = {
				...formData,
				points: Number.parseInt(formData.points),
			} as Partial<User>

			await createUser(userData)
			router.push(`/${locale}/users/list`)
		} catch (err: unknown) {
			console.error('Error creating user:', err)

			if (err && typeof err === 'object' && 'response' in err) {
				const axiosError = err as AxiosError<{
					errors: Record<string, string[]>
				}>
				if (axiosError.response?.data?.errors) {
					setServerErrors(axiosError.response.data.errors)
					setError(t('errors.validation'))
				} else {
					setError(t('errors.general'))
				}
			} else {
				setError(t('errors.general'))
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
					{t('backToList')}
				</Link>
			</div>

			{error && (
				<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
					{error}
				</div>
			)}

			<form
				onSubmit={handleSubmit}
				className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
			>
				<div className="mb-4">
					<label
						className="block text-gray-700 text-sm font-bold mb-2"
						htmlFor="name"
					>
						{t('form.name.label')} <span className="text-red-500">*</span>
					</label>
					<input
						className={`shadow appearance-none border ${serverErrors.name ? 'border-red-500' : ''} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
						id="name"
						type="text"
						name="name"
						value={formData.name}
						onChange={handleChange}
					/>
					{serverErrors.name && (
						<p className="text-red-500 text-xs italic">
							{serverErrors.name[0]}
						</p>
					)}
				</div>

				<div className="mb-4">
					<label
						className="block text-gray-700 text-sm font-bold mb-2"
						htmlFor="email"
					>
						{t('form.email.label')} <span className="text-red-500">*</span>
					</label>
					<input
						className={`shadow appearance-none border ${serverErrors.email ? 'border-red-500' : ''} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
						id="email"
						type="text"
						name="email"
						value={formData.email}
						onChange={handleChange}
					/>
					{serverErrors.email && (
						<p className="text-red-500 text-xs italic">
							{serverErrors.email[0]}
						</p>
					)}
				</div>

				<div className="mb-4">
					<label
						className="block text-gray-700 text-sm font-bold mb-2"
						htmlFor="phone_number"
					>
						{t('form.phone.label')}
					</label>
					<input
						className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
						id="phone_number"
						type="text"
						name="phone_number"
						value={formData.phone_number}
						onChange={handleChange}
					/>
				</div>

				<div className="mb-4">
					<label
						className="block text-gray-700 text-sm font-bold mb-2"
						htmlFor="address"
					>
						{t('form.address.label')}
					</label>
					<input
						className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
						id="address"
						type="text"
						name="address"
						value={formData.address}
						onChange={handleChange}
					/>
				</div>

				<div className="mb-4">
					<label
						className="block text-gray-700 text-sm font-bold mb-2"
						htmlFor="birth_date"
					>
						{t('form.birthDate.label')}
					</label>
					<input
						className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline [&::-webkit-datetime-edit]:text-gray-700 [&::-webkit-datetime-edit-fields-wrapper]:text-gray-700 [&::-webkit-datetime-edit-text]:text-gray-700 [&::-webkit-datetime-edit-month-field]:text-gray-700 [&::-webkit-datetime-edit-day-field]:text-gray-700 [&::-webkit-datetime-edit-year-field]:text-gray-700 [&::-webkit-datetime-edit]:placeholder-shown:text-transparent"
						id="birth_date"
						type="date"
						name="birth_date"
						value={formData.birth_date}
						onChange={handleChange}
						lang={locale}
					/>
				</div>

				<div className="mb-4">
					<label
						className="block text-gray-700 text-sm font-bold mb-2"
						htmlFor="gender"
					>
						{t('form.gender.label')}
					</label>
					<select
						className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
						id="gender"
						name="gender"
						value={formData.gender}
						onChange={handleChange}
					>
						<option value="">{t('form.gender.placeholder')}</option>
						<option value="male">{t('form.gender.options.male')}</option>
						<option value="female">{t('form.gender.options.female')}</option>
						<option value="other">{t('form.gender.options.other')}</option>
					</select>
				</div>

				<div className="mb-4">
					<label
						className="block text-gray-700 text-sm font-bold mb-2"
						htmlFor="membership_status"
					>
						{t('form.membershipStatus.label')}
					</label>
					<select
						className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
						id="membership_status"
						name="membership_status"
						value={formData.membership_status}
						onChange={handleChange}
					>
						<option value="pending">{t('form.membershipStatus.options.pending')}</option>
						<option value="active">{t('form.membershipStatus.options.active')}</option>
						<option value="inactive">{t('form.membershipStatus.options.inactive')}</option>
					</select>
				</div>

				<div className="mb-4">
					<label
						className="block text-gray-700 text-sm font-bold mb-2"
						htmlFor="notes"
					>
						{t('form.notes.label')}
					</label>
					<textarea
						className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
						id="notes"
						name="notes"
						value={formData.notes}
						onChange={handleChange}
					/>
				</div>

				<div className="mb-4">
					<label
						className="block text-gray-700 text-sm font-bold mb-2"
						htmlFor="points"
					>
						{t('form.points.label')}
					</label>
					<input
						className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
						id="points"
						type="number"
						name="points"
						value={formData.points}
						onChange={handleChange}
					/>
				</div>

				<div className="flex items-center justify-end">
					<button
						type="submit"
						disabled={loading}
						className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
					>
						{loading ? t('submit.loading') : t('submit.label')}
					</button>
				</div>
			</form>
		</div>
	)
}
