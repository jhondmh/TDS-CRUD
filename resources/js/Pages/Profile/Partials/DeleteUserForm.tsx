import { useForm } from '@inertiajs/react';
import classNames from 'classnames';
import React, { useRef, useState } from 'react';
import useRoute from '@/Hooks/useRoute';
import ActionSection from '@/Components/ActionSection';
import DangerButton from '@/Components/DangerButton';
// import DialogModal from '@/Components/DialogModal';
// import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import SecondaryButton from '@/Components/SecondaryButton';
import { TextInput } from '@mantine/core';
import { Modal } from '@mantine/core';

export default function DeleteUserForm() {
	const route = useRoute();
	const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
	const form = useForm({
		password: '',
	});
	const passwordRef = useRef<HTMLInputElement>(null);

	function confirmUserDeletion() {
		setConfirmingUserDeletion(true);

		setTimeout(() => passwordRef.current?.focus(), 250);
	}

	function deleteUser() {
		form.delete(route('current-user.destroy'), {
			preserveScroll: true,
			onSuccess: () => closeModal(),
			onError: () => passwordRef.current?.focus(),
			onFinish: () => form.reset(),
		});
	}

	function closeModal() {
		setConfirmingUserDeletion(false);
		form.reset();
	}

	return (
		<ActionSection
			title={'Eliminar cuenta'}
			description={'Elimine permanentemente su cuenta.'}
		>
			<div className="max-w-xl text-sm text-gray-600 dark:text-gray-400">
				Una vez eliminada su cuenta, todos sus recursos y datos serán se eliminarán de forma permanente. Antes de eliminar su cuenta, por favor descargue cualquier dato o información que desee conservar.
			</div>

			<div className="mt-5">
				<DangerButton onClick={confirmUserDeletion}>
					Eliminar cuenta
				</DangerButton>
			</div>

			{/* <!-- Delete Account Confirmation Modal --> */}
			<Modal
				opened={confirmingUserDeletion}
				onClose={closeModal}
				title={'Eliminar cuenta'}
				size="lg"
			>
				{/* <DialogModal.Content title={'Delete Account'}> */}
				<div className='px-6'>
					¿Está seguro de que desea eliminar su cuenta? Una vez eliminada su cuenta, todos sus recursos y datos se borrarán permanentemente. Por favor, introduzca su contraseña para confirmar que desea eliminar permanentemente su cuenta.
				</div>
				<div className="mt-4 px-6">
					<TextInput
						type="password"
						className="mt-1 block w-full"
						placeholder="Contraseña"
						value={form.data.password}
						onChange={e =>
							form.setData('password', e.currentTarget.value)
						}
                        spellCheck={false}
					/>

					<InputError
						message={form.errors.password}
						className="mt-2"
					/>
				</div>
				{/* </DialogModal.Content> */}
				{/* <DialogModal.Footer> */}
				<div className="mt-6 px-6 flex justify-end">
					<SecondaryButton onClick={closeModal}>
						Cancelar
					</SecondaryButton>
					<DangerButton
						onClick={deleteUser}
						className={classNames('ml-2', {
							'opacity-25': form.processing,
						})}
						disabled={form.processing}
					>
						Eliminar cuenta
					</DangerButton>
					{/* </DialogModal.Footer> */}
				</div>
			</Modal>
		</ActionSection>
	);
}
