import { useForm } from '@inertiajs/react';
import classNames from 'classnames';
import React, { useRef } from 'react';
import useRoute from '@/Hooks/useRoute';
import ActionMessage from '@/Components/ActionMessage';
import FormSection from '@/Components/FormSection';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
// import TextInput from '@/Components/TextInput';
import { TextInput } from '@mantine/core';

export default function UpdatePasswordForm() {
	const route = useRoute();
	const form = useForm({
		current_password: '',
		password: '',
		password_confirmation: '',
	});
	const passwordRef = useRef<HTMLInputElement>(null);
	const currentPasswordRef = useRef<HTMLInputElement>(null);

	function updatePassword() {
		form.put(route('user-password.update'), {
			errorBag: 'updatePassword',
			preserveScroll: true,
			onSuccess: () => form.reset(),
			onError: () => {
				if (form.errors.password) {
					form.reset('password', 'password_confirmation');
					passwordRef.current?.focus();
				}

				if (form.errors.current_password) {
					form.reset('current_password');
					currentPasswordRef.current?.focus();
				}
			},
		});
	}

	return (
		<FormSection
			onSubmit={updatePassword}
			title={'Actualizar contraseña'}
			description={
				'Asegúrate de que tu cuenta utiliza una contraseña larga y aleatoria para mantener la seguridad.'
			}
			renderActions={() => (
				<>
					<ActionMessage
						on={form.recentlySuccessful}
						className="mr-3"
					>
						Saved.
					</ActionMessage>

					<PrimaryButton
						className={classNames({
							'opacity-25': form.processing,
						})}
						disabled={form.processing}
					>
						Guardar
					</PrimaryButton>
				</>
			)}
		>
			<div className="col-span-6 sm:col-span-4">
				<InputLabel htmlFor="current_password">
					Contraseña actual
				</InputLabel>
				<TextInput
					id="current_password"
					type="password"
					className="mt-1 block w-full"
					ref={currentPasswordRef}
					value={form.data.current_password}
					onChange={e =>
						form.setData('current_password', e.currentTarget.value)
					}
					autoComplete="current-password"
					spellCheck={false}
				/>
				<InputError
					message={form.errors.current_password}
					className="mt-2"
				/>
			</div>

			<div className="col-span-6 sm:col-span-4">
				<InputLabel htmlFor="password">Nueva contraseña</InputLabel>
				<TextInput
					id="password"
					type="password"
					className="mt-1 block w-full"
					value={form.data.password}
					onChange={e =>
						form.setData('password', e.currentTarget.value)
					}
					autoComplete="new-password"
					ref={passwordRef}
                    spellCheck={false}
				/>
				<InputError message={form.errors.password} className="mt-2" />
			</div>

			<div className="col-span-6 sm:col-span-4">
				<InputLabel htmlFor="password_confirmation">
					Confirmar contraseña
				</InputLabel>
				<TextInput
					id="password_confirmation"
					type="password"
					className="mt-1 block w-full"
					value={form.data.password_confirmation}
					onChange={e =>
						form.setData(
							'password_confirmation',
							e.currentTarget.value,
						)
					}
					autoComplete="new-password"
                    spellCheck={false}
				/>
				<InputError
					message={form.errors.password_confirmation}
					className="mt-2"
				/>
			</div>
		</FormSection>
	);
}
