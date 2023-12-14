import { Link, useForm, Head } from '@inertiajs/react';
import classNames from 'classnames';
import React from 'react';
import useRoute from '@/Hooks/useRoute';
import AuthenticationCard from '@/Components/AuthenticationCard';
import Checkbox from '@/Components/Checkbox';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
// import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';

import { TextInput, Group, Divider, Text, Center, Anchor } from '@mantine/core';

import { GoogleButton } from './GoogleButton';
import { TwitterButton } from './TwitterButton';
import { FacebookButton } from './FacebookButton';

interface Props {
	canResetPassword: boolean;
	status: string;
}

export default function Login({ canResetPassword, status }: Props) {
	const route = useRoute();
	const form = useForm({
		email: '',
		password: '',
		remember: '',
	});

	function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		form.post(route('login'), {
			onFinish: () => form.reset('password'),
		});
	}

	return (
		<AuthenticationCard>
			<Head title="login" />

			{status && (
				<div className="mb-4 font-medium text-sm text-green-600 dark:text-green-400">
					{status}
				</div>
			)}

			<Center>
				<Text size="lg" fw={500}>
					Inicia sesión con
				</Text>
			</Center>

			<Group grow mb="md" mt="md">
				<Anchor href="auth/google">
					<GoogleButton radius="xl">Google</GoogleButton>
				</Anchor>
				<Anchor href="">
					<TwitterButton radius="xl">Twitter</TwitterButton>
				</Anchor>
				<Anchor href="auth/facebook">
					<FacebookButton radius="xl">Facebook</FacebookButton>
				</Anchor>
			</Group>

			<Divider
				label="O continúa con un correo electrónico"
				labelPosition="center"
				my="lg"
			/>

			<form onSubmit={onSubmit}>
				<div>
					<InputLabel htmlFor="email">Email</InputLabel>
					<TextInput
						id="email"
						type="email"
						className="mt-1 block w-full"
						value={form.data.email}
						onChange={e =>
							form.setData('email', e.currentTarget.value)
						}
						required
						autoFocus
					/>
					<InputError className="mt-2" message={form.errors.email} />
				</div>

				<div className="mt-4">
					<InputLabel htmlFor="password">Password</InputLabel>
					<TextInput
						id="password"
						type="password"
						className="mt-1 block w-full"
						value={form.data.password}
						onChange={e =>
							form.setData('password', e.currentTarget.value)
						}
						required
						autoComplete="current-password"
					/>
					<InputError
						className="mt-2"
						message={form.errors.password}
					/>
				</div>

				<div className="mt-4">
					<label className="flex items-center">
						<Checkbox
							name="remember"
							checked={form.data.remember === 'on'}
							onChange={e =>
								form.setData(
									'remember',
									e.currentTarget.checked ? 'on' : '',
								)
							}
						/>
						<span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
							Remember me
						</span>
					</label>
				</div>

				<div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0 mt-4">
					{canResetPassword && (
						<div>
							<Link
								href={route('password.request')}
								className="underline text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
							>
								Forgot your password?
							</Link>
						</div>
					)}

					<div className="flex items-center justify-end">
						<Link
							href={route('register')}
							className="underline text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
						>
							Need an account?
						</Link>

						<PrimaryButton
							className={classNames('ml-4', {
								'opacity-25': form.processing,
							})}
							disabled={form.processing}
						>
							Log in
						</PrimaryButton>
					</div>
				</div>
			</form>
		</AuthenticationCard>
	);
}
