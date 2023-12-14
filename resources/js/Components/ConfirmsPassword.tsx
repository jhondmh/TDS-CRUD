import axios from 'axios';
import classNames from 'classnames';
import React, { PropsWithChildren, useRef, useState } from 'react';
import useRoute from '@/Hooks/useRoute';
// import DialogModal from '@/Components/DialogModal';
import { Modal } from '@mantine/core';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
// import TextInput from '@/Components/TextInput';
import { TextInput } from '@mantine/core';
import SecondaryButton from '@/Components/SecondaryButton';

interface Props {
	title?: string;
	content?: string;
	button?: string;
	onConfirm(): void;
}

export default function ConfirmsPassword({
	title = 'Confirm Password',
	content = 'For your security, please confirm your password to continue.',
	button = 'Confirm',
	onConfirm,
	children,
}: PropsWithChildren<Props>) {
	const route = useRoute();
	const [confirmingPassword, setConfirmingPassword] = useState(false);
	const [form, setForm] = useState({
		password: '',
		error: '',
		processing: false,
	});
	const passwordRef = useRef<HTMLInputElement>(null);

	function startConfirmingPassword() {
		axios.get(route('password.confirmation')).then(response => {
			if (response.data.confirmed) {
				onConfirm();
			} else {
				setConfirmingPassword(true);

				setTimeout(() => passwordRef.current?.focus(), 250);
			}
		});
	}

	function confirmPassword() {
		setForm({ ...form, processing: true });

		axios
			.post(route('password.confirm'), {
				password: form.password,
			})
			.then(() => {
				closeModal();
				setTimeout(() => onConfirm(), 250);
			})
			.catch(error => {
				setForm({
					...form,
					processing: false,
					error: error.response.data.errors.password[0],
				});
				passwordRef.current?.focus();
			});
	}

	function closeModal() {
		setConfirmingPassword(false);
		setForm({ processing: false, password: '', error: '' });
	}

	return (
		<span>
			<span onClick={startConfirmingPassword}>{children}</span>

			<Modal
				opened={confirmingPassword}
				onClose={closeModal}
				title={title}
                size={580}
			>
				{/* <DialogModal.Content title={title}> */}
				<div className='px-6'>{content}</div>

				<div className="mt-4 px-6">
					<TextInput
						ref={passwordRef}
						type="password"
						className="mt-1 block w-full"
						placeholder="Password"
						value={form.password}
						onChange={e =>
							setForm({
								...form,
								password: e.currentTarget.value,
							})
						}
                        spellCheck={false}
					/>

					<InputError message={form.error} className="mt-2" />
				</div>
				{/* </DialogModal.Content> */}

				{/* <DialogModal.Footer> */}
				<div className="mt-6 px-6 flex justify-end">
					<SecondaryButton onClick={closeModal}>
						Cancel
					</SecondaryButton>

					<PrimaryButton
						className={classNames('ml-2', {
							'opacity-25': form.processing,
						})}
						onClick={confirmPassword}
						disabled={form.processing}
					>
						{button}
					</PrimaryButton>
					{/* </DialogModal.Footer> */}
				</div>
			</Modal>
		</span>
	);
}
