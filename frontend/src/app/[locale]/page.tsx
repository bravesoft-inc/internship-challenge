import Link from 'next/link'
import { notFound } from 'next/navigation'

type Props = {
	params: Promise<{ locale: string }>
}

export default async function Home({ params }: Props) {
	const resolvedParams = await params
	const locale = resolvedParams.locale

	let messages;
	try {
		messages = (await import(`@/locales/${locale}.json`)).default;
	} catch (error) {
		notFound();
	}

	return (
		<div className="space-y-6">
			<h1 className="text-3xl font-bold">
				{messages.home.title}
			</h1>

			<div className="prose">
				<p>
					{messages.home.description}
				</p>

				<ul>
					<li>{messages.home.features.userList}</li>
					<li>{messages.home.features.userDetail}</li>
					<li>{messages.home.features.addUser}</li>
					<li>{messages.home.features.editUser}</li>
					<li>{messages.home.features.deleteUser}</li>
					<li>{messages.home.features.importCsv}</li>
					<li>{messages.home.features.exportCsv}</li>
				</ul>

				<p>
					{messages.home.challenge}
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				<Link
					href={`/${locale}/users/list`}
					className="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100"
				>
					<h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900">
						{messages.home.cards.userList.title}
					</h5>
					<p className="font-normal text-gray-700">
						{messages.home.cards.userList.description}
					</p>
				</Link>

				<Link
					href={`/${locale}/users/add`}
					className="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100"
				>
					<h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900">
						{messages.home.cards.addUser.title}
					</h5>
					<p className="font-normal text-gray-700">
						{messages.home.cards.addUser.description}
					</p>
				</Link>

				<Link
					href={`/${locale}/users/import`}
					className="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100"
				>
					<h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900">
						{messages.home.cards.importCsv.title}
					</h5>
					<p className="font-normal text-gray-700">
						{messages.home.cards.importCsv.description}
					</p>
				</Link>

				<Link
					href={`/${locale}/users/export`}
					className="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100"
				>
					<h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900">
						{messages.home.cards.exportCsv.title}
					</h5>
					<p className="font-normal text-gray-700">
						{messages.home.cards.exportCsv.description}
					</p>
				</Link>
			</div>
		</div>
	)
}
