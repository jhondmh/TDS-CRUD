import { router } from '@inertiajs/core';
import { Link, useForm } from '@inertiajs/react';
import classNames from 'classnames';
import React, { useRef, useState, useEffect } from 'react';
import useRoute from '@/Hooks/useRoute';
import ActionMessage from '@/Components/ActionMessage';
import FormSection from '@/Components/FormSection';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
// import TextInput from '@/Components/TextInput';
import SecondaryButton from '@/Components/SecondaryButton';
import { User } from '@/types';
import useTypedPage from '@/Hooks/useTypedPage';
import { TextInput, Select } from '@mantine/core';

import dataDepartamentos from '../../../Datos/DataDepartamentos';
import dataProvincias from '../../../Datos/DataProvincias';

import { DatePickerInput } from '@mantine/dates';
import dayjs from 'dayjs';

interface Props {
	user: User;
}

export default function UpdateProfileInformationForm({ user }: Props) {
	const form = useForm({
		_method: 'PUT',
		name: user.name,
		// surname: user.surname,
		paternal: user.paternal,
		maternal: user.maternal,
		dni: user.dni,
		email: user.email,
		fecha_nac: user.fecha_nac,

		departamento: user.departamento,
		provincia: user.provincia,
		distrito: user.distrito,

		current_address: user.current_address,

		photo: null as File | null,
	});
	const route = useRoute();
	const [photoPreview, setPhotoPreview] = useState<string | null>(null);
	const photoRef = useRef<HTMLInputElement>(null);
	const page = useTypedPage();
	const [verificationLinkSent, setVerificationLinkSent] = useState(false);

	function updateProfileInformation() {
		form.setData({
			...form.data,
			departamento,
			provincia,
			distrito,
		});
		// console.log('Enviando datos:', form.data);
		form.post(route('user-profile-information.update'), {
			errorBag: 'updateProfileInformation',
			preserveScroll: true,
			onSuccess: () => clearPhotoFileInput(),
		});
	}

	function selectNewPhoto() {
		photoRef.current?.click();
	}

	function updatePhotoPreview() {
		const photo = photoRef.current?.files?.[0];

		if (!photo) {
			return;
		}

		form.setData('photo', photo);

		const reader = new FileReader();

		reader.onload = e => {
			setPhotoPreview(e.target?.result as string);
		};

		reader.readAsDataURL(photo);
	}

	function deletePhoto() {
		router.delete(route('current-user-photo.destroy'), {
			preserveScroll: true,
			onSuccess: () => {
				setPhotoPreview(null);
				clearPhotoFileInput();
			},
		});
	}

	function clearPhotoFileInput() {
		if (photoRef.current?.value) {
			photoRef.current.value = '';
			form.setData('photo', null);
		}
	}

	// Lugares
	const [departamento, setDepartamento] = useState(user.departamento || '');
	const [provincia, setProvincia] = useState(user.provincia || '');
	const [distrito, setDistrito] = useState(user.distrito || '');

	// // Efecto para inicializar estados al montar el componente
	React.useEffect(() => {
		setDepartamento(user.departamento || '');
		setProvincia(user.provincia || '');
		setDistrito(user.distrito || '');

		setDateValue(initialDate); // Inicializa dateValue cuando el componente se monta
	}, []);
	// Efecto para inicializar estados al montar el componente
	// useEffect(() => {
	// 	setDepartamento(user.departamento || '');
	// 	setProvincia(user.provincia || '');
	// 	setDistrito(user.distrito || '');
	// 	setDateValue(initialDate); // Inicializa dateValue cuando el componente se monta
	// }, [user]);

	const handleDepartamentoChange = (value: string) => {
		const newValue = value || ''; // Proporciona un valor predeterminado
		setDepartamento(newValue);
		setDepartamento(value);
		setProvincia('');
		setDistrito('');
		form.setData({
			...form.data, // Incluye todas las propiedades actuales
			departamento: value,
			provincia: '',
			distrito: '',
		});
	};

	const handleProvinciaChange = (value: string) => {
		setProvincia(value);
		setDistrito('');
		form.setData({
			...form.data, // Incluye todas las propiedades actuales
			provincia: value,
			distrito: '',
		});
	};

	const handleDistritoChange = (value: string) => {
		setDistrito(value);
		form.setData({
			...form.data, // Incluye todas las propiedades actuales
			distrito: value,
		});
	};

	// Obtiene las provincias para el departamento seleccionado
	const provincias = departamento
		? dataDepartamentos[departamento] || []
		: [];

	// Obtiene los distritos para la provincia seleccionada
	const distritos = provincia ? dataProvincias[provincia] || [] : [];

	// const [dateValue, setDateValue] = useState(null);
	// Convierte la fecha_nac de user a un objeto Date
	const initialDate = user.fecha_nac ? dayjs(user.fecha_nac).toDate() : null;

	// Inicializa el estado dateValue con la fecha existente
	const [dateValue, setDateValue] = useState<Date | null>(initialDate);

	useEffect(() => {
		if (dateValue) {
			// Formatear la fecha como desees, por ejemplo, a YYYY-MM-DD
			const formattedDate = dateValue.toISOString().split('T')[0];
			form.setData('fecha_nac', formattedDate);
		} else {
			form.setData('fecha_nac', ''); // o null, dependiendo de cómo quieras manejar fechas no seleccionadas
		}
	}, [dateValue]);

	return (
		<FormSection
			onSubmit={updateProfileInformation}
			title={'Información de Perfil'}
			description={`Actualice la información de perfil y la dirección de correo electrónico de su cuenta.`}
			renderActions={() => (
				<>
					<ActionMessage
						on={form.recentlySuccessful}
						className="mr-3"
					>
						Guardado.
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
			{/* <!-- Profile Photo --> */}
			{page.props.jetstream.managesProfilePhotos ? (
				<div className="col-span-6 sm:col-span-4">
					{/* <!-- Profile Photo File Input --> */}
					<input
						type="file"
						className="hidden"
						ref={photoRef}
						onChange={updatePhotoPreview}
					/>

					<InputLabel htmlFor="photo" value="Photo" />

					{photoPreview ? (
						// <!-- New Profile Photo Preview -->
						<div className="mt-2">
							<span
								className="block rounded-full w-20 h-20"
								style={{
									backgroundSize: 'cover',
									backgroundRepeat: 'no-repeat',
									backgroundPosition: 'center center',
									backgroundImage: `url('${photoPreview}')`,
								}}
							></span>
						</div>
					) : (
						// <!-- Current Profile Photo -->
						<div className="mt-2">
							<img
								src={user.profile_photo_url}
								alt={user.name}
								className="rounded-full h-20 w-20 object-cover"
							/>
						</div>
					)}

					<SecondaryButton
						className="mt-2 mr-2"
						type="button"
						onClick={selectNewPhoto}
					>
						Select A New Photo
					</SecondaryButton>

					{user.profile_photo_path ? (
						<SecondaryButton
							type="button"
							className="mt-2"
							onClick={deletePhoto}
						>
							Remove Photo
						</SecondaryButton>
					) : null}

					<InputError message={form.errors.photo} className="mt-2" />
				</div>
			) : null}

			{/* <!-- Name --> */}
			<div className="col-span-6 sm:col-span-4">
				<InputLabel htmlFor="name" value="Nombres" />
				<TextInput
					id="name"
					type="text"
					className="mt-1 block w-full"
					value={form.data.name}
					onChange={e =>
						form.setData(
							'name',
							e.currentTarget.value.toUpperCase(),
						)
					}
					autoComplete="name"
					spellCheck={false}
				/>
				<InputError message={form.errors.name} className="mt-2" />
			</div>

			<div className="col-span-6 sm:col-span-4">
				<InputLabel htmlFor="paternal" value="Apellido Paterno" />
				<TextInput
					id="paternal"
					type="text"
					className="mt-1 block w-full"
					value={form.data.paternal}
					onChange={e =>
						form.setData(
							'paternal',
							e.currentTarget.value.toUpperCase(),
						)
					}
					autoComplete="paternal"
					spellCheck={false}
				/>
				<InputError message={form.errors.paternal} className="mt-2" />
			</div>

			<div className="col-span-6 sm:col-span-4">
				<InputLabel htmlFor="maternal" value="Apellido Materno" />
				<TextInput
					id="maternal"
					type="text"
					className="mt-1 block w-full"
					value={form.data.maternal}
					onChange={e =>
						form.setData(
							'maternal',
							e.currentTarget.value.toUpperCase(),
						)
					}
					autoComplete="maternal"
					spellCheck={false}
				/>
				<InputError message={form.errors.maternal} className="mt-2" />
			</div>

			<div className="col-span-6 sm:col-span-4">
				<InputLabel htmlFor="departamento" value="Departamento" />
				{/* <TextInput
					id="departamento"
					type="text"
					className="mt-1 block w-full"
					value={form.data.departamento}
					onChange={e => form.setData('departamento', e.currentTarget.value)}
					autoComplete="departamento"
                    spellCheck={false}
				/> */}

				<Select
					key={`departamento-${departamento}`}
					id="departamento"
					name="departamento"
					value={departamento || ''}
					className="mt-1 block w-full"
					autoComplete="departamento"
					data={Object.keys(dataDepartamentos)}
					// onChange={(value) => setData("departamento", value)}
					// onChange={handleDepartamentoChange}
					onChange={(value: string) =>
						handleDepartamentoChange(value)
					}
					searchable
					nothingFoundMessage="No se ha encontrado nada..."
					clearable
					comboboxProps={{
						transitionProps: { transition: 'pop', duration: 200 },
					}}
				/>
				<InputError
					message={form.errors.departamento}
					className="mt-2"
				/>
			</div>

			<div className="col-span-6 sm:col-span-4">
				<InputLabel htmlFor="provincia" value="Provincia" />
				<Select
					key={`provincia-${provincia}`}
					id="provincia"
					name="provincia"
					value={provincia || ''}
					className="mt-1 block w-full"
					autoComplete="provincia"
					data={provincias}
					// onChange={(value) => setData("provincia", value)}
					// onChange={handleProvinciaChange}
					onChange={(value: string) => handleProvinciaChange(value)}
					searchable
					nothingFoundMessage="No se ha encontrado nada..."
					clearable
					comboboxProps={{
						transitionProps: { transition: 'pop', duration: 200 },
					}}
				/>
				<InputError message={form.errors.provincia} className="mt-2" />
			</div>

			<div className="col-span-6 sm:col-span-4">
				<InputLabel htmlFor="distrito" value="Distrito" />
				<Select
					key={`distrito-${distrito}`}
					id="distrito"
					name="distrito"
					value={distrito || ''}
					className="mt-1 block w-full"
					autoComplete="distrito"
					data={distritos}
					// onChange={(value) => setData("distrito", value)}
					// onChange={(value) => setDistrito(value)}

					onChange={(value: string) => handleDistritoChange(value)}
					searchable
					nothingFoundMessage="No se ha encontrado nada..."
					clearable
					comboboxProps={{
						transitionProps: { transition: 'pop', duration: 200 },
					}}
				/>
				<InputError message={form.errors.distrito} className="mt-2" />
			</div>

			<div className="col-span-6 sm:col-span-4">
				<InputLabel htmlFor="fecha_nac" value="Fecha de Nacimiento" />
				{/* <TextInput
					id="fecha_nac"
					type="text"
					className="mt-1 block w-full"
					value={form.data.fecha_nac}
					onChange={e =>
						form.setData(
							'fecha_nac',
							e.currentTarget.value,
						)
					}
					autoComplete="fecha_nac"
					spellCheck={false}
				/> */}

				<DatePickerInput
					hideOutsideDates
					dropdownType="modal"
					// leftSection={icon}
					leftSectionPointerEvents="none"
					// label="Fecha de Nacimiento"
					// {...form.getInputProps('fecha_nac')}
					placeholder="Selecciona una fecha"
					value={dateValue}
					onChange={setDateValue}
					// minDate={minDate} // Establecer fecha mínima
					// maxDate={maxDate} // Establecer fecha máxima
					required
					// renderDay={dayRenderer}
				/>
				<InputError message={form.errors.fecha_nac} className="mt-2" />
			</div>

			<div className="col-span-6 sm:col-span-4">
				<InputLabel
					htmlFor="current_address"
					value="Dirección actual"
				/>
				<TextInput
					id="current_address"
					type="text"
					className="mt-1 block w-full"
					value={form.data.current_address}
					onChange={e =>
						form.setData('current_address', e.currentTarget.value)
					}
					autoComplete="current_address"
					spellCheck={false}
				/>
				<InputError
					message={form.errors.current_address}
					className="mt-2"
				/>
			</div>

			<div className="col-span-6 sm:col-span-4">
				<InputLabel htmlFor="dni" value="DNI" />
				<TextInput
					id="dni"
					type="text"
					className="mt-1 block w-full"
					value={form.data.dni}
					onChange={e => form.setData('dni', e.currentTarget.value)}
					autoComplete="dni"
					maxLength={8}
					spellCheck={false}
				/>
				<InputError message={form.errors.dni} className="mt-2" />
			</div>

			{/* <!-- Email --> */}
			<div className="col-span-6 sm:col-span-4">
				<InputLabel htmlFor="email" value="Email" />
				<TextInput
					id="email"
					type="email"
					className="mt-1 block w-full"
					value={form.data.email}
					onChange={e => form.setData('email', e.currentTarget.value)}
					spellCheck={false}
				/>
				<InputError message={form.errors.email} className="mt-2" />

				{page.props.jetstream.hasEmailVerification &&
				user.email_verified_at === null ? (
					<div>
						<p className="text-sm mt-2 dark:text-white">
							Your email address is unverified.
							<Link
								href={route('verification.send')}
								method="post"
								as="button"
								className="underline text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
								onClick={e => {
									e.preventDefault();
									setVerificationLinkSent(true);
								}}
							>
								Click here to re-send the verification email.
							</Link>
						</p>
						{verificationLinkSent && (
							<div className="mt-2 font-medium text-sm text-green-600 dark:text-green-400">
								A new verification link has been sent to your
								email address.
							</div>
						)}
					</div>
				) : null}
			</div>
		</FormSection>
	);
}
