import { Link, useForm, Head } from '@inertiajs/react';
import classNames from 'classnames';
import React, { useState } from 'react';
import useRoute from '@/Hooks/useRoute';
import useTypedPage from '@/Hooks/useTypedPage';
import AuthenticationCard from '@/Components/AuthenticationCard';
import Checkbox from '@/Components/Checkbox';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
// import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import { TextInput, Select } from '@mantine/core';

import dataDepartamentos from '../../Datos/DataDepartamentos';
import dataProvincias from '../../Datos/DataProvincias';

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
		fecha_nac: '',

		departamento: '',
		provincia: '',
		distrito: '',

		current_address: '',

		terms: false,
	});

	function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		form.post(route('register'), {
			onFinish: () => form.reset('password', 'password_confirmation'),
		});
	}

	const [departamento, setDepartamento] = useState('');
	const [provincia, setProvincia] = useState('');
	const [distrito, setDistrito] = useState('');

	// Actualiza las provincias cuando cambia el departamento
	const handleDepartamentoChange = (value: string) => {
		form.setData('departamento', value);
		setDepartamento(value);
		setProvincia('');
		setDistrito('');
	};

	// Actualiza los distritos cuando cambia la provincia
	const handleProvinciaChange = (value: string) => {
		form.setData('provincia', value);
		setProvincia(value);
		setDistrito('');
	};

	const handleDistritoChange = (value: string) => {
		form.setData('distrito', value);
		setDistrito(value);
	};

	// Obtiene las provincias para el departamento seleccionado
	const provincias = departamento
		? dataDepartamentos[departamento] || []
		: [];

	// Obtiene los distritos para la provincia seleccionada
	const distritos = provincia ? dataProvincias[provincia] || [] : [];

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

				<div className="flex justify-center mt-4">
					<div className="mt-1 block flex-grow md:w-2/6 mr-4 w-full">
						{/* <TextInput
							id="departamento"
							label="Departamento"
							type="text"
							// className="mt-1 block flex-grow md:w-2/6 w-full"
							value={form.data.departamento}
							onChange={e =>
								form.setData(
									'departamento',
									e.currentTarget.value.toUpperCase(),
								)
							}
							required
							autoComplete="departamento"
						/> */}
						<Select
							label="Departamento"
							key={`departamento-${departamento}`}
							id="departamento"
							name="departamento"
							value={departamento}
							className="mt-1 block w-full"
							autoComplete="departamento"
							data={Object.keys(dataDepartamentos)}
							// onChange={(value) => setData("departamento", value)}
							// onChange={handleDepartamentoChange}
							onChange={(value: string) =>
								handleDepartamentoChange(value)
							}
							required
							searchable
							nothingFoundMessage="No se ha encontrado nada..."
							clearable
							comboboxProps={{
								transitionProps: {
									transition: 'pop',
									duration: 200,
								},
							}}
						/>

						<InputError
							className="mt-2"
							message={form.errors.departamento}
						/>
					</div>

					<div className="mt-1 block flex-grow md:w-2/6 mr-4 w-full">
						<Select
							label="Provincia"
							key={`provincia-${provincia}`}
							id="provincia"
							name="provincia"
							value={provincia}
							className="mt-1 block w-full"
							autoComplete="provincia"
							data={provincias}
							// onChange={(value) => setData("provincia", value)}
							// onChange={handleProvinciaChange}
							onChange={(value: string) =>
								handleProvinciaChange(value)
							}
							required
							searchable
							nothingFoundMessage="No se ha encontrado nada..."
							clearable
							comboboxProps={{
								transitionProps: {
									transition: 'pop',
									duration: 200,
								},
							}}
						/>
						<InputError
							className="mt-2"
							message={form.errors.provincia}
						/>
					</div>

					<div className="mt-1 block flex-grow md:w-2/6 w-full">
						<Select
							label="Distrito"
							key={`distrito-${distrito}`}
							id="distrito"
							name="distrito"
							value={distrito}
							className="mt-1 block w-full"
							autoComplete="distrito"
							data={distritos}
							// onChange={(value) => setData("distrito", value)}
							// onChange={(value) => setDistrito(value)}

							onChange={(value: string) =>
								handleDistritoChange(value)
							}
							required
							searchable
							nothingFoundMessage="No se ha encontrado nada..."
							clearable
							comboboxProps={{
								transitionProps: {
									transition: 'pop',
									duration: 200,
								},
							}}
						/>
						<InputError
							className="mt-2"
							message={form.errors.distrito}
						/>
					</div>
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
							id="fecha_nac"
							label="Fecha de Nacimiento"
							type="text"
							// className="mt-1 block flex-grow md:w-2/6 w-full"
							value={form.data.fecha_nac}
							onChange={e =>
								form.setData(
									'fecha_nac',
									e.currentTarget.value.toUpperCase(),
								)
							}
							required
							autoComplete="fecha_nac"
						/>
						<InputError
							className="mt-2"
							message={form.errors.fecha_nac}
						/>
					</div>
				</div>

				<div className="mt-4 block flex-grow w-full">
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
					<InputError className="mt-2" message={form.errors.email} />
				</div>

				<div className="mt-4 block flex-grow w-full">
					<TextInput
						id="current_address"
						label="Dirección actual"
						type="text"
						// className="mt-1 block flex-grow md:w-2/6 w-full"
						value={form.data.current_address}
						onChange={e =>
							form.setData(
								'current_address',
								e.currentTarget.value,
							)
						}
						required
						autoComplete="current_address"
					/>
					<InputError
						className="mt-2"
						message={form.errors.current_address}
					/>
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
