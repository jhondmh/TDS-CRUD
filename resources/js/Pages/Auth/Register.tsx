import { Link, useForm, Head } from '@inertiajs/react';
import classNames from 'classnames';
import React from 'react';
import useRoute from '@/Hooks/useRoute';
import useTypedPage from '@/Hooks/useTypedPage';
import AuthenticationCard from '@/Components/AuthenticationCard';
import Checkbox from '@/Components/Checkbox';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
// import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import { TextInput, Flex } from '@mantine/core';

export default function Register() {
	const page = useTypedPage();
	const route = useRoute();
	const form = useForm({
		name: '',
		// surname: '',
		paternal: '',
		maternal: '',
		dni: '',
		email: '',
		password: '',
		password_confirmation: '',
		terms: false,
	});

	function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		form.post(route('register'), {
			onFinish: () => form.reset('password', 'password_confirmation'),
		});
	}

	return (
		<AuthenticationCard>
			<Head title="Register" />

			<form onSubmit={onSubmit}>
				<div className="flex justify-center">
					{/* <InputLabel htmlFor="name">Name</InputLabel> */}
					{/* <Flex justify="flex-center"> */}
					<div className="mt-1 block flex-grow mr-4 md:w-2/6 w-full">
						<TextInput
							id="name"
							label="Nombres"
							type="text"
							// className="mt-1 block flex-grow mr-4 md:w-2/6 w-full"
							value={form.data.name}
							onChange={e =>
								form.setData(
									'name',
									e.currentTarget.value.toUpperCase(),
								)
							}
							required
							autoFocus
							autoComplete="name"
						/>
						<InputError
							className="mt-2"
							message={form.errors.name}
						/>
					</div>

					{/* <div className="mt-4"> */}
					{/* <InputLabel htmlFor="name">Name</InputLabel> */}
					<div className="mt-1 block flex-grow mr-4 md:w-2/6 w-full">
						<TextInput
							id="paternal"
							label="Apellido Paterno"
							type="text"
							// className="mt-1 block flex-grow mr-4 md:w-2/6 w-full"
							value={form.data.paternal}
							onChange={e =>
								form.setData(
									'paternal',
									e.currentTarget.value.toUpperCase(),
								)
							}
							required
							autoComplete="paternal"
						/>
						<InputError
							className="mt-2"
							message={form.errors.paternal}
						/>
					</div>

					<div className="mt-1 block flex-grow md:w-2/6 w-full">
						<TextInput
							id="maternal"
							label="Apellido Materno"
							type="text"
							// className="mt-1 block flex-grow md:w-2/6 w-full"
							value={form.data.maternal}
							onChange={e =>
								form.setData(
									'maternal',
									e.currentTarget.value.toUpperCase(),
								)
							}
							required
							autoComplete="maternal"
						/>
						<InputError
							className="mt-2"
							message={form.errors.maternal}
						/>
					</div>
					{/* </Flex> */}
				</div>

				<div className="mt-4 flex justify-center">
					{/* <InputLabel htmlFor="name">Name</InputLabel> */}
					{/* <Flex justify="flex-center"> */}
					<div className="mt-1 mr-2 block w-full">
						<TextInput
							id="dni"
							label="DNI"
							type="text"
							// className="mt-1 mr-2 block w-full"
							value={form.data.dni}
							onChange={e =>
								form.setData('dni', e.currentTarget.value)
							}
							maxLength={8}
							required
							autoComplete="dni"
						/>
						<InputError
							className="mt-2"
							message={form.errors.dni}
						/>
					</div>

					{/* <div className="mt-4"> */}
					{/* <InputLabel htmlFor="email">Email</InputLabel> */}
					<div className="mt-1 ml-2 block w-full">
						<TextInput
							id="email"
							label="Email"
							type="email"
							// className="mt-1 ml-2 block w-full"
							value={form.data.email}
							onChange={e =>
								form.setData('email', e.currentTarget.value)
							}
							required
						/>
						<InputError
							className="mt-2"
							message={form.errors.email}
						/>
					</div>
				</div>

				<div className="mt-4 flex justify-center">
					{/* <InputLabel htmlFor="password">Password</InputLabel> */}
					<div className="mt-1 mr-4 block w-full">
						<TextInput
							id="password"
							label="Contraseña"
							type="password"
							// className="mt-1 mr-4 block w-full"
							value={form.data.password}
							onChange={e =>
								form.setData('password', e.currentTarget.value)
							}
							required
							autoComplete="new-password"
						/>
						<InputError
							className="mt-2"
							message={form.errors.password}
						/>
					</div>

					{/* <div className="mt-4"> */}
					{/* <InputLabel htmlFor="password_confirmation">
						Confirm Password
					</InputLabel> */}
					<div className="mt-1 block w-full">
						<TextInput
							id="password_confirmation"
							label="Confirmar contraseña"
							type="password"
							// className="mt-1 block w-full"
							value={form.data.password_confirmation}
							onChange={e =>
								form.setData(
									'password_confirmation',
									e.currentTarget.value,
								)
							}
							required
							autoComplete="new-password"
						/>
						<InputError
							className="mt-2"
							message={form.errors.password_confirmation}
						/>
					</div>
				</div>

				{page.props.jetstream.hasTermsAndPrivacyPolicyFeature && (
					<div className="mt-4">
						<InputLabel htmlFor="terms">
							<div className="flex items-center">
								<Checkbox
									name="terms"
									id="terms"
									checked={form.data.terms}
									onChange={e =>
										form.setData(
											'terms',
											e.currentTarget.checked,
										)
									}
									required
								/>

								<div className="ml-2">
									I agree to the
									<a
										target="_blank"
										href={route('terms.show')}
										className="underline text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
									>
										Terms of Service
									</a>
									and
									<a
										target="_blank"
										href={route('policy.show')}
										className="underline text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
									>
										Privacy Policy
									</a>
								</div>
							</div>
							<InputError
								className="mt-2"
								message={form.errors.terms}
							/>
						</InputLabel>
					</div>
				)}

				<div className="flex items-center justify-end mt-4">
					<Link
						href={route('login')}
						className="underline text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
					>
						¿Ya se ha registrado?
					</Link>

					<PrimaryButton
						className={classNames('ml-4', {
							'opacity-25': form.processing,
						})}
						disabled={form.processing}
					>
						Registrarse
					</PrimaryButton>
				</div>
			</form>
		</AuthenticationCard>
	);
}
