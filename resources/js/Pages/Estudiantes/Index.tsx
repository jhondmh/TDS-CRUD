import cx from 'clsx';
import axios from 'axios';
// import React from 'react';
// import Welcome from '@/Components/Welcome';
import AppLayout from '@/Layouts/AppLayout';
//funcionando
import { Inertia } from '@inertiajs/inertia';
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
	UnstyledButton,
	Group,
	Text,
	Center,
	keys,
	Checkbox,
	Avatar,
	Select,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import {
	IconCalendar,
	IconSelector,
	IconChevronDown,
	IconChevronUp,
	IconSearch,
} from '@tabler/icons-react';

import TableSortClasses from '../../../css/TableSort.module.css';
import TableSelectionClasses from '../../../css/TableSelection.module.css';
import TableScrollAreaClasses from '../../../css/TableScrollArea.module.css';

interface RowData {
	nombre: string;
	apellido_pat: string;
	apellido_mat: string;
	nota1: string;
	departamento: string;
}

interface ThProps {
	children: React.ReactNode;
	reversed: boolean;
	sorted: boolean;
	onSort(): void;
}

function Th({ children, reversed, sorted, onSort }: ThProps) {
	const Icon = sorted
		? reversed
			? IconChevronUp
			: IconChevronDown
		: IconSelector;
	return (
		<Table.Th className={TableSortClasses.th}>
			<UnstyledButton
				onClick={onSort}
				className={TableSortClasses.control}
			>
				<Group justify="space-between">
					<Text fw={500} fz="sm">
						{children}
					</Text>
					<Center className={TableSortClasses.icon}>
						<Icon
							style={{ width: rem(16), height: rem(16) }}
							stroke={1.5}
						/>
					</Center>
				</Group>
			</UnstyledButton>
		</Table.Th>
	);
}

// function filterData(data: RowData[], search: string) {
// 	const query = search.toLowerCase().trim();
// 	return data.filter(item =>
// 		keys(data[0]).some(key => item[key].toLowerCase().includes(query)),
// 	);
// }

// function filterData(data: RowData[], search: string) {
//   const query = search.toLowerCase().trim();
//   return data.filter(item =>
//     keys(data[0]).some(key =>
//       String(item[key]).toLowerCase().includes(query)
//     ),
//   );
// }

function filterData(data: RowData[], search: string) {
	const query = search.toLowerCase().trim();
	if (data.length === 0) {
		return []; // Retorna un arreglo vacío si no hay datos
	}
	return data.filter(item =>
		Object.keys(data[0]).some(key =>
			String(item[key]).toLowerCase().includes(query),
		),
	);
}

// function sortData(
// 	data: RowData[],
// 	payload: {
// 		sortBy: keyof RowData | null;
// 		reversed: boolean;
// 		search: string;
// 	},
// ) {
// 	const { sortBy } = payload;

// 	if (!sortBy) {
// 		return filterData(data, payload.search);
// 	}

// 	return filterData(
// 		[...data].sort((a, b) => {
// 			if (payload.reversed) {
// 				return b[sortBy].localeCompare(a[sortBy]);
// 			}

// 			return a[sortBy].localeCompare(b[sortBy]);
// 		}),
// 		payload.search,
// 	);
// }



function sortData(data, payload) {
  const { sortBy, reversed, search } = payload;

  if (!sortBy) {
    return filterData(data, search);
  }

  return filterData(
    [...data].sort((a, b) => {
      // Comprueba si el valor es un número
      if (!isNaN(a[sortBy]) && !isNaN(b[sortBy])) {
        // Ordena como número
        return reversed ? b[sortBy] - a[sortBy] : a[sortBy] - b[sortBy];
      } else {
        // Ordena como cadena
        if (reversed) {
          return b[sortBy].localeCompare(a[sortBy]);
        } else {
          return a[sortBy].localeCompare(b[sortBy]);
        }
      }
    }),
    search,
  );
}






export default function Dashboard(props) {
	const route = useRoute();

	// const [modal, setModal] = useState(false);
	const [title, setTitle] = useState('');
	const [operation, setOperation] = useState(1);
	const NombreInput = useRef();
	const Apellido_Pat_Input = useRef();
	const Apellido_Mat_Input = useRef();
	const Nota1Input = useRef();
	const DepartamentoInput = useRef();

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
		nota1: '',
		departamento: '',
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
		nota1,
		departamento,
	) => {
		// setModal(true),
		open();
		setOperation(op);
		setData({
			nombre: nombre,
			apellido_pat: apellido_pat,
			apellido_mat: apellido_mat,
			fecha_nac: fecha_nac,
			nota1: nota1,
			departamento: departamento,
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
				nota1: nota1,
				departamento: departamento,
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
					if (errors.nota1) {
						reset('nota1');
						Nota1Input.current.focus();
					}
					if (errors.departamento) {
						reset('departamento');
						DepartamentoInput.current.focus();
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
					if (errors.nota1) {
						reset('nota1');
						Nota1Input.current.focus();
					}
					if (errors.departamento) {
						reset('departamento');
						DepartamentoInput.current.focus();
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

	// Ordenamiento
	const [search, setSearch] = useState('');
	const [sortedData, setSortedData] = useState(props.estudiantes);
	const [sortBy, setSortBy] = useState<keyof RowData | null>(null);
	const [reverseSortDirection, setReverseSortDirection] = useState(false);

	// Selección
	const [selection, setSelection] = useState([]);
	const toggleRow = (id: string) =>
		setSelection(current =>
			current.includes(id)
				? current.filter(item => item !== id)
				: [...current, id],
		);
	const toggleAll = () =>
		setSelection(current =>
			current.length === props.estudiantes.length
				? []
				: props.estudiantes.map(item => item.id),
		);

	//Uso de effect para mantener el ordenamiento de columnas y a la vez recoger datos de forma dinámica
	useEffect(() => {
		setSortedData(
			sortData(props.estudiantes, {
				sortBy,
				reversed: reverseSortDirection,
				search,
			}),
		);
	}, [props.estudiantes, sortBy, reverseSortDirection, search]);

	const setSorting = (field: keyof RowData) => {
		const reversed = field === sortBy ? !reverseSortDirection : false;
		setReverseSortDirection(reversed);
		setSortBy(field);
		setSortedData(
			sortData(props.estudiantes, { sortBy: field, reversed, search }),
		);
	};

	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = event.currentTarget;
		setSearch(value);
		setSortedData(
			sortData(props.estudiantes, {
				sortBy,
				reversed: reverseSortDirection,
				search: value,
			}),
		);
		// setSortedData(prevData => [...prevData, nuevoEstudiante]);
	};

	const idsToSend = selection.map(id => parseInt(id, 10));

	const eliminarMultiples = () => {
		if (selection.length === 0) {
			Swal.fire(
				'Por favor, selecciona al menos un estudiante para eliminar.',
			);
			return;
		}

		const alerta2 = Swal.mixin({ buttonsStyling: true });

		alerta2
			.fire({
				title: '¿Estás seguro?',
				text: 'Esta acción no se puede deshacer',
				icon: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				confirmButtonText: 'Sí, eliminar!',
			})
			.then(result => {
				if (result.isConfirmed) {
					// Usar el método `post` o `put` del hook useForm
					console.log('seleccion antes de post', selection);
					console.log('idsToSend antes de post', idsToSend);
					axios
						.post(route('estudiantes.multipleDestroy'), {
							ids: idsToSend,
						})
						.then(response => {
							Swal.fire(
								'Eliminados!',
								response.data.success,
								'success',
							);
							// Actualiza el estado local para reflejar la eliminación
							const updatedData = sortedData.filter(
								estudiante =>
									!idsToSend.includes(estudiante.id),
							);
							setSortedData(updatedData);
							setSelection([]);
						})
						.catch(error => {
							Swal.fire(
								'Error',
								'Ocurrió un error al eliminar los estudiantes.',
								'error',
							);
						});
				}

				console.log('seleccion despues de post', selection);
				console.log('idsToSend despues de post', idsToSend);
			});
	};

	// const eliminarMultiples = () => {
	// 	if (selection.length === 0) {
	// 		Swal.fire(
	// 			'Por favor, selecciona al menos un estudiante para eliminar.',
	// 		);
	// 		return;
	// 	}

	// 	const alerta2 = Swal.mixin({ buttonsStyling: true });

	// 	alerta2
	// 		.fire({
	// 			title: '¿Estás seguro?',
	// 			text: 'Esta acción no se puede deshacer',
	// 			icon: 'warning',
	// 			showCancelButton: true,
	// 			confirmButtonColor: '#3085d6',
	// 			cancelButtonColor: '#d33',
	// 			confirmButtonText: 'Sí, eliminar!',
	// 		})
	// 		.then(result => {
	// 			if (result.isConfirmed) {
	// 				Inertia.post(route('estudiantes.multipleDestroy'), {
	// 					ids: selection,
	// 					onSuccess: () => {
	// 						Swal.fire(
	// 							'Eliminados!',
	// 							'Los estudiantes han sido eliminados.',
	// 							'success',
	// 						);
	// 						// Actualiza el estado local para reflejar la eliminación
	// 						const updatedData = sortedData.filter(
	// 							estudiante =>
	// 								!selection.includes(estudiante.id),
	// 						);
	// 						setSortedData(updatedData);
	// 						setSelection([]);
	// 					},
	// 					onError: () => {
	// 						Swal.fire(
	// 							'Error',
	// 							'Ocurrió un error al eliminar los estudiantes.',
	// 							'error',
	// 						);
	// 					},
	// 				});
	// 			}
	// 		});
	// };

	const rows = sortedData.map((estudiante, i) => {
		const selected = selection.includes(estudiante.id);
		return (
			<Table.Tr
				key={estudiante.id}
				className={cx({
					[TableSelectionClasses.rowSelected]: selected,
				})}
			>
				<Table.Td>
					<Checkbox
						checked={selection.includes(estudiante.id)}
						onChange={() => toggleRow(estudiante.id)}
					/>
				</Table.Td>
				<Table.Td>{i + 1}</Table.Td>
				<Table.Td>{estudiante.nombre}</Table.Td>
				<Table.Td>{estudiante.apellido_pat}</Table.Td>
				<Table.Td>{estudiante.apellido_mat}</Table.Td>
				<Table.Td>
					{dayjs(estudiante.fecha_nac).format('MMMM D, YYYY')}
				</Table.Td>

				<Table.Td>{estudiante.nota1}</Table.Td>
				<Table.Td>{estudiante.departamento}</Table.Td>

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
									estudiante.nota1,
									estudiante.departamento,
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
		);
	});

	return (
		<AppLayout
			title="Estudiantes"
			renderHeader={() => (
				<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
					Estudiantes
				</h2>
			)}
		>
			<div className="bg-dark grid v-screen place-items-center pt-6">
				<div className="mt-3 mb-3 flex justify-end space-x-4">
					<PrimaryButton onClick={() => openModal(1)}>
						<i className="fa-solid fa-circle-plus mr-2"></i>
						Añadir
					</PrimaryButton>

					<PrimaryButton onClick={eliminarMultiples}>
						Eliminar seleccionados
					</PrimaryButton>
				</div>
			</div>
			<div className="overflow-auto bg-dark grid v-screen place-items-center pb-6 dark:bg-gray-900">
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
					<div className="mt-6 mx-16">
						<TextInput
							placeholder="Buscar por cualquier campo"
							mb="md"
							leftSection={
								<IconSearch
									style={{ width: rem(16), height: rem(16) }}
									stroke={1.5}
								/>
							}
							value={search}
							onChange={handleSearchChange}
						/>
					</div>

					{/* <Table.ScrollContainer minWidth={500}> */}
					<Table highlightOnHover>
						{/* <Table.Thead
							className={cx(TableScrollAreaClasses.header, {
								[TableScrollAreaClasses.scrolled]: scrolled,
							})}
						> */}

						<Table.Tbody>
							<Table.Tr>
								<Table.Th style={{ width: rem(40) }}>
									<Checkbox
										onChange={toggleAll}
										checked={
											selection.length ===
											props.estudiantes.length
										}
										indeterminate={
											selection.length > 0 &&
											selection.length !==
												props.estudiantes.length
										}
									/>
								</Table.Th>
								<Table.Th className="px-2 py-2">#</Table.Th>
								<Th
									sorted={sortBy === 'nombre'}
									reversed={reverseSortDirection}
									onSort={() => setSorting('nombre')}
								>
									Nombres
								</Th>
								<Th
									sorted={sortBy === 'apellido_pat'}
									reversed={reverseSortDirection}
									onSort={() => setSorting('apellido_pat')}
								>
									Apellido Paterno
								</Th>
								<Th
									sorted={sortBy === 'apellido_mat'}
									reversed={reverseSortDirection}
									onSort={() => setSorting('apellido_mat')}
								>
									Apellido Materno
								</Th>

								<Table.Th className="px-2 py-2">
									Fecha de Nacimiento
								</Table.Th>


								{/* <Table.Th className="px-2 py-2">
									Nota 1
								</Table.Th> */}

								<Th
									sorted={sortBy === 'nota1'}
									reversed={reverseSortDirection}
									onSort={() => setSorting('nota1')}
								>
									Nota 1
								</Th>

								<Th
									sorted={sortBy === 'departamento'}
									reversed={reverseSortDirection}
									onSort={() => setSorting('departamento')}
								>
									Departamento
								</Th>

								<Table.Th className="px-2 py-2">
									Editar
								</Table.Th>
								<Table.Th className="px-2 py-2">
									Eliminar
								</Table.Th>
							</Table.Tr>
						</Table.Tbody>

						{/* <Table.Tr className="bg-gray-100 dark:bg-gray-800 dark:text-white">
							<Table.Th className="px-2 py-2">#</Table.Th>
							<Table.Th className="px-2 py-2">Nombres</Table.Th>
							<Table.Th className="px-2 py-2">
								Apellido Paterno
							</Table.Th>
							<Table.Th className="px-2 py-2">
								Apellido Materno
							</Table.Th>
							<Table.Th className="px-2 py-2">
								Fecha de Nacimiento
							</Table.Th>
							<Table.Th className="px-2 py-2">Editar</Table.Th>
							<Table.Th className="px-2 py-2">Eliminar</Table.Th>
						</Table.Tr> */}
						{/* </Table.Thead> */}

						{/* <Table.Tbody>
							{rows.length > 0 ? (
								rows
							) : (
								<Table.Tr>
									<Table.Td
										colSpan={Object.keys(data[0]).length}
									>
										<Text fw={500} ta="center">
											Nothing found
										</Text>
									</Table.Td>
								</Table.Tr>
							)}
						</Table.Tbody> */}
						<Table.Tbody>
							{rows.length > 0 ? (
								rows
							) : (
								<Table.Tr>
									<Table.Td
										colSpan={
											data && data[0]
												? Object.keys(data[0]).length
												: 1
										}
									>
										<Text fw={500} ta="center">
											Nothing found
										</Text>
									</Table.Td>
								</Table.Tr>
							)}
						</Table.Tbody>

						{/* <Table.Tbody>{rows}</Table.Tbody> */}
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

					<div className="mt-6">
						{/* <InputLabel for="nombre" value="Nombres"></InputLabel> */}
						<TextInput
							id="nota1"
							name="nota1"
							label="Nota 1"
							placeholder="Nota 1"
							ref={Nota1Input}
							required
							value={data.nota1 || ''}
							onChange={e => setData('nota1', e.target.value)}
							spellCheck={false}
							// className="mt-1 block w-full"
							data-autofocus
						/>
						<InputError
							message={errors.nota1}
							className="mt-2"
						></InputError>
					</div>

					<div className="mt-6">
						{/* <InputLabel for="nombre" value="Nombres"></InputLabel> */}
						{/* <TextInput
							id="departamento"
							name="departamento"
							label="Departamento"
							placeholder="Departamento"
							ref={DepartamentoInput}
							required
							value={data.departamento || ''}
							onChange={e =>
								setData('departamento', e.target.value)
							}
							spellCheck={false}
							// className="mt-1 block w-full"
							data-autofocus
						/> */}

						<Select
							id="departamento"
							name="departamento"
							label="Departamento"
							placeholder="Departamento"
							data={['Puno', 'Arequipa', 'Lima']}
							ref={DepartamentoInput}
							required
							value={data.departamento || ''}
							// onChange={e =>
							// 	setData('departamento', e.target.value)
							// }
                            onChange={(value) => setData('departamento', value)}
						/>

						<InputError
							message={errors.departamento}
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
