import cx from 'clsx';
// import React from 'react';
// import Welcome from '@/Components/Welcome';
import AppLayout from '@/Layouts/AppLayout';
//funcionando
import { useForm } from '@inertiajs/react';
// import classNames from 'classnames';
import React, { useRef, useState, useEffect } from 'react';
import useRoute from '@/Hooks/useRoute';
// import ActionSection from '@/Components/ActionSection';
import DangerButton from '@/Components/DangerButton';
// import DialogModal from '@/Components/DialogModal';
// import TextInput from '@/Components/TextInput';
// import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
// import SaveButton from '@/Components/SaveButton';
import WarningButton from '@/Components/WarningButton';
// import SecondaryButton from '@/Components/SecondaryButton';
import Swal from 'sweetalert2';

import { useDisclosure } from '@mantine/hooks';

import dayjs from 'dayjs';
// import 'dayjs/locale/es';
// dayjs.locale('es');
import {
	rem,
	TextInput,
	Modal,
	Flex,
	Indicator,
	Table,
	ScrollArea,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { IconCalendar } from '@tabler/icons-react';

import TableScrollAreaClasses from '../../../css/TableScrollArea.module.css';

export default function Dashboard(props) {
	const route = useRoute();

	// const [modal, setModal] = useState(false);
	const [title, setTitle] = useState('');
	const [operation, setOperation] = useState(1);
	const NombreInput = useRef();
	const Apellido_Pat_Input = useRef();
	const Apellido_Mat_Input = useRef();

	const [scrolled, setScrolled] = useState(false);

	const [dateValue, setDateValue] = useState(null);
	const Fecha_Nac_Input = useRef();
	const icon = (
		<IconCalendar
			style={{ width: rem(18), height: rem(18) }}
			stroke={1.5}
		/>
	);
	// Para rastrear si el selector de fecha está abierto
	// const [datePickerOpen, setDatePickerOpen] = useState(false);

	// Fecha mínima: 1 de Enero de 1900
	const minDate = new Date(1900, 0, 1);

	// Fecha máxima: Fecha actual
	const maxDate = new Date();

	const dayRenderer = date => {
		const day = date.getDate();
		const today = new Date();

		// Verifica si el día actual es igual al día que se está renderizando
		const isToday =
			day === today.getDate() &&
			date.getMonth() === today.getMonth() &&
			date.getFullYear() === today.getFullYear();

		return (
			<Indicator size={6} color="red" offset={-5} disabled={!isToday}>
				<div>{day}</div>
			</Indicator>
		);
	};

	// Modal
	const [opened, { open, close }] = useDisclosure(false);

	const {
		data,
		setData,
		delete: destroy,
		post,
		put,
		processing,
		reset,
		errors,
	} = useForm({
		id: '',
		nombre: '',
		apellido_pat: '',
		apellido_mat: '',
		fecha_nac: '',
	});

	useEffect(() => {
		if (dateValue) {
			const formattedDate = dateValue.toISOString().split('T')[0];
			setData({ ...data, fecha_nac: formattedDate });
		}
	}, [dateValue]);

	const openModal = (
		op,
		id,
		nombre,
		apellido_pat,
		apellido_mat,
		fecha_nac,
	) => {
		// setModal(true),
		open();
		setOperation(op);
		setData({
			nombre: nombre,
			apellido_pat: apellido_pat,
			apellido_mat: apellido_mat,
			fecha_nac: fecha_nac,
		});
		if (op === 1) {
			setTitle('Añadir estudiante');
			setDateValue(null);
		} else {
			setTitle('Editar estudiante');
			// setDateValue(fecha_nac ? new Date(fecha_nac) : null);
			setDateValue(fecha_nac ? dayjs(fecha_nac).toDate() : null);
			setData({
				id: id,
				nombre: nombre,
				apellido_pat: apellido_pat,
				apellido_mat: apellido_mat,
				fecha_nac: fecha_nac,
			});
			// console.log("🚀 ~ file: Index.tsx:63 ~ Dashboard ~ fecha_nac:", fecha_nac)
		}
	};
	const closeModal = () => {
		// setModal(false);
		close();
	};

	const save = e => {
		e.preventDefault();
		if (operation === 1) {
			post(route('estudiantes.store'), {
				onSuccess: () => {
					ok('Estudiante añadido con éxito');
				},
				onerror: () => {
					if (errors.nombre) {
						reset('nombre');
						NombreInput.current.focus();
					}
					if (errors.apellido_pat) {
						reset('apellido_pat');
						Apellido_Pat_Input.current.focus();
					}
					if (errors.apellido_mat) {
						reset('apellido_mat');
						Apellido_Mat_Input.current.focus();
					}
					if (errors.fecha_nac) {
						reset('fecha_nac');
						Fecha_Nac_Input.current.focus();
					}
				},
			});
		} else {
			put(route('estudiantes.update', data.id), {
				onSuccess: () => {
					ok('Estudiante actualizado con éxito');
				},
				onerror: () => {
					if (errors.nombre) {
						reset('nombre');
						NombreInput.current.focus();
					}
					if (errors.apellido_pat) {
						reset('apellido_pat');
						Apellido_Pat_Input.current.focus();
					}
					if (errors.apellido_mat) {
						reset('apellido_mat');
						Apellido_Mat_Input.current.focus();
					}
					if (errors.fecha_nac) {
						reset('fecha_nac');
						Fecha_Nac_Input.current.focus();
					}
				},
			});
		}
	};

	const ok = mensaje => {
		reset();
		closeModal();
		Swal.fire({ title: mensaje, icon: 'success' });
	};
	const eliminar = (id, nombre) => {
		const alerta = Swal.mixin({ buttonsStyling: true });
		alerta
			.fire({
				title:
					'¿Estás seguro de eliminar el estudiante ' + nombre + '?',
				text: 'Esta operación es irreversible',
				icon: 'question',
				showCancelButton: true,
				// confirmButtonColor:'#3085d6',
				confirmButtonText:
					'<i class="fa-solid fa-check"></i> Sí, eliminar',
				customClass: {
					confirmButton:
						'bg-red-600 border border-transparent text-white hover:bg-red-500 active:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800',
				},
				cancelButtonText: '<i class="fa-solid fa-ban"></i> Cancelar',
			})
			.then(result => {
				if (result.isConfirmed) {
					destroy(route('estudiantes.destroy', id), {
						onSuccess: () => {
							ok('Estudiante eliminado');
						},
					});
				}
			});
	};

	const rows = props.estudiantes.map((estudiante, i) => (
		<Table.Tr key={estudiante.id}>
			<Table.Td>{i + 1}</Table.Td>
			<Table.Td>{estudiante.nombre}</Table.Td>
			<Table.Td>{estudiante.apellido_pat}</Table.Td>
			<Table.Td>{estudiante.apellido_mat}</Table.Td>
			<Table.Td>
				{dayjs(estudiante.fecha_nac).format('MMMM D, YYYY')}
			</Table.Td>

			<Table.Td>
				<div className="flex justify-center items-center w-full h-full">
					<WarningButton
						onClick={() =>
							openModal(
								2,
								estudiante.id,
								estudiante.nombre,
								estudiante.apellido_pat,
								estudiante.apellido_mat,
								estudiante.fecha_nac,
							)
						}
					>
						<i className="fa-solid fa-pen-to-square"></i>
					</WarningButton>
				</div>
			</Table.Td>

			<Table.Td>
				<div className="flex justify-center items-center w-full h-full">
					<DangerButton
						onClick={() =>
							eliminar(estudiante.id, estudiante.nombre)
						}
					>
						<i className="fa-solid fa-trash"></i>
					</DangerButton>
				</div>
			</Table.Td>
		</Table.Tr>
	));

	return (
		<AppLayout
			title="Estudiantes"
			renderHeader={() => (
				<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
					Estudiantes
				</h2>
			)}
		>
			<div className="bg-dark grid v-screen place-items-center">
				<div className="mt-3 mb-3 flex justify-end">
					<PrimaryButton onClick={() => openModal(1)}>
						<i className="fa-solid fa-circle-plus mr-2"></i>
						Añadir
					</PrimaryButton>
				</div>
			</div>
			<div className="overflow-auto bg-dark grid v-screen place-items-center py-6 dark:bg-gray-900">
				{/* <table className="table-auto border border-gray-400 dark:border-gray-700 text-black mx-2"> */}
				{/* <ScrollArea w={700} h={600} > */}
				<ScrollArea
					// w={500}
					h={400}
					// offsetScrollbars
					onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
					scrollbarSize={6}
					classNames={TableScrollAreaClasses}
				>
					{/* <Table.ScrollContainer minWidth={500}> */}
					<Table highlightOnHover>
						<Table.Thead
							className={cx(TableScrollAreaClasses.header, {
								[TableScrollAreaClasses.scrolled]: scrolled,
							})}
						>
							<Table.Tr className="bg-gray-100 dark:bg-gray-800 dark:text-white">
								<Table.Th className="px-2 py-2">#</Table.Th>
								<Table.Th className="px-2 py-2">
									Nombres
								</Table.Th>
								<Table.Th className="px-2 py-2">
									Apellido Paterno
								</Table.Th>
								<Table.Th className="px-2 py-2">
									Apellido Materno
								</Table.Th>
								<Table.Th className="px-2 py-2">
									Fecha de Nacimiento
								</Table.Th>
								<Table.Th className="px-2 py-2">
									Editar
								</Table.Th>
								<Table.Th className="px-2 py-2">
									Eliminar
								</Table.Th>
							</Table.Tr>
						</Table.Thead>
						<Table.Tbody>{rows}</Table.Tbody>
					</Table>
					{/* </Table.ScrollContainer> */}
				</ScrollArea>
			</div>

			<Modal opened={opened} onClose={close} title={title}>
				{/* <DialogModal.Content title={title}> */}
				<form id="myForm" onSubmit={save} className="px-6">
					<div className="mt-6">
						{/* <InputLabel for="nombre" value="Nombres"></InputLabel> */}
						<TextInput
							id="nombre"
							name="nombre"
							label="Nombres"
							placeholder="Nombres"
							ref={NombreInput}
							required
							value={data.nombre || ''}
							onChange={e => setData('nombre', e.target.value)}
							spellCheck={false}
							// className="mt-1 block w-full"
							data-autofocus
						/>
						<InputError
							message={errors.nombre}
							className="mt-2"
						></InputError>
					</div>
					<div className="mt-6">
						{/* <InputLabel
							for="apellido_pat"
							value="Apellido Paterno"
						></InputLabel> */}
						<TextInput
							id="apellido_pat"
							name="apellido_pat"
							label="Apellido Paterno"
							placeholder="Apellido Paterno"
							ref={Apellido_Pat_Input}
							value={data.apellido_pat || ''}
							required
							onChange={e =>
								setData('apellido_pat', e.target.value)
							}
							spellCheck={false}
							// className="mt-1 block w-full"
						/>
						<InputError
							message={errors.apellido_pat}
							className="mt-2"
						></InputError>
					</div>
					<div className="mt-6">
						{/* <InputLabel
							for="apellido_mat"
							value="Apellido Materno"
						></InputLabel> */}
						<TextInput
							id="apellido_mat"
							name="apellido_mat"
							label="Apellido Materno"
							placeholder="Apellido Materno"
							ref={Apellido_Mat_Input}
							value={data.apellido_mat || ''}
							required
							onChange={e =>
								setData('apellido_mat', e.target.value)
							}
							spellCheck={false}
							// className="mt-1 block w-full"
						/>
						<InputError
							message={errors.apellido_mat}
							className="mt-2"
						></InputError>
					</div>
					<div className="mt-6">
						{/* <InputLabel
								for="fecha_nac"
								value="Fecha de Nacimiento"
							></InputLabel> */}
						{/* <TextInput
								id="fecha_nac"
								name="fecha_nac"
								ref={Fecha_Nac_Input}
								value={data.fecha_nac || ''}
								required="required"
								onChange={e =>
									setData('fecha_nac', e.target.value)
								}
								className="mt-1 block w-full"
							></TextInput> */}

						<DatePickerInput
							hideOutsideDates
							dropdownType="modal"
							leftSection={icon}
							leftSectionPointerEvents="none"
							label="Fecha de Nacimiento"
							placeholder="Selecciona una fecha"
							// Para manejar los eventos de apertura y cierre del selector de fecha
							// onFocus={() => setDatePickerOpen(true)}
							// onClose={() => {
							// 	setDatePickerOpen(false);
							// 	if (!dateValue) {
							// 		setDateValue(null); // restablece dateValue a null si no se seleccionó una fecha
							// 	}
							// }}
							// onClick={() => {
							// 	if (!dateValue && !datePickerOpen) {
							// 		setDateValue(new Date()); // Para seleccionar la fecha actual al añadir un estudiante
							// 	}
							// }}
							value={dateValue}
							onChange={setDateValue}
							minDate={minDate} // Establecer fecha mínima
							maxDate={maxDate} // Establecer fecha máxima
							required
							renderDay={dayRenderer}
						/>

						<InputError
							message={errors.fecha_nac}
							className="mt-2"
						></InputError>
					</div>
				</form>
				{/* </DialogModal.Content> */}

				{/* <DialogModal.Footer> */}
				<div className="px-6 pb-2 pt-7">
					<Flex justify="flex-end">
						{/* <Group mt="xl"> */}
						<SecondaryButton onClick={close} variant="default">
							Cancel
						</SecondaryButton>

						<PrimaryButton
							type="submit"
							form="myForm"
							processing={processing.toString()}
							className="ml-2"
						>
							<i className="fa-solid fa-floppy-disk mr-2"></i>
							Guardar
						</PrimaryButton>
						{/* </Group> */}
					</Flex>
				</div>
				{/* </DialogModal.Footer> */}
			</Modal>
		</AppLayout>
	);
}