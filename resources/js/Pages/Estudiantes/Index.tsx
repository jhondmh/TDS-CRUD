import cx from 'clsx';
import axios from 'axios';
// import React from 'react';
// import Welcome from '@/Components/Welcome';
import AppLayout from '@/Layouts/AppLayout';
//funcionando
// import { Inertia } from '@inertiajs/inertia';
// import { useForm } from '@inertiajs/react';
import { useForm } from '@mantine/form';
// import classNames from 'classnames';
import React, { useState, useEffect } from 'react';
import useRoute from '@/Hooks/useRoute';
// import ActionSection from '@/Components/ActionSection';
import DangerButton from '@/Components/DangerButton';
// import DialogModal from '@/Components/DialogModal';
// import TextInput from '@/Components/TextInput';
// import InputLabel from '@/Components/InputLabel';
// import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
// import SaveButton from '@/Components/SaveButton';
import WarningButton from '@/Components/WarningButton';
// import SecondaryButton from '@/Components/SecondaryButton';
// import Swal from 'sweetalert2';

import Swal from 'sweetalert2';
import '@sweetalert2/themes/dark/dark.css';

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
	Checkbox,
	Select,
	Button,
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
import ModalHeaderBodyClasses from '../../../css/ModalHeaderBody.module.css';

interface RowData {
	nombre: string;
	apellido_pat: string;
	apellido_mat: string;
	nota1: string;
	nota2: string;
	nota3: string;
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
		<Table.Th
			className={TableSortClasses.th}
			style={{ whiteSpace: 'nowrap' }}
		>
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

	const [estudiantes, setEstudiantes] = useState(props.estudiantes);

	// const [modal, setModal] = useState(false);
	const [title, setTitle] = useState('');
	const [operation, setOperation] = useState(1);
	// const NombreInput = useRef();
	// const Apellido_Pat_Input = useRef();
	// const Apellido_Mat_Input = useRef();
	// const Nota1Input = useRef();
	// const DepartamentoInput = useRef();

	const [scrolled, setScrolled] = useState(false);

	const [isSubmitting, setIsSubmitting] = useState(false);

	const [dateValue, setDateValue] = useState(null);
	// const Fecha_Nac_Input = useRef();
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

	// const {
	// 	data,
	// 	setData,
	// 	delete: destroy,
	// 	post,
	// 	put,
	// 	processing,
	// 	reset,
	// 	errors,
	// } = useForm({
	// 	id: '',
	// 	nombre: '',
	// 	apellido_pat: '',
	// 	apellido_mat: '',
	// 	fecha_nac: '',
	// 	nota1: '',
	// 	departamento: '',
	// });

	const form = useForm({
		initialValues: {
			id: '',
			nombre: '',
			apellido_pat: '',
			apellido_mat: '',
			fecha_nac: null, // Puede que necesites ajustar esto según tu DatePicker
			nota1: '',
			nota2: '',
			nota3: '',
			departamento: '',
		},

		validate: {
			nombre: value => {
				if (!value) return 'El nombre es requerido';
				if (value.length > 25)
					return 'El Nombre muy largo (máx. 25 caracteres)';
				if (/\d/.test(value)) return 'Nombre no debe contener números';
				return null;
			},
			apellido_pat: value => {
				if (!value) return 'El Apellido Paterno requerido';
				if (value.length > 25)
					return 'Apellido Paterno muy largo (máx. 25 caracteres)';
				if (/\d/.test(value))
					return 'El Apellido Paterno no debe contener números';
				return null;
			},
			apellido_mat: value => {
				if (!value) return 'El Apellido Materno requerido';
				if (value.length > 25)
					return 'Apellido Materno muy largo (máx. 25 caracteres)';
				if (/\d/.test(value))
					return 'El Apellido Materno no debe contener números';
				return null;
			},
			fecha_nac: value => {
				if (!value) return 'Fecha de nacimiento es requerido';
				const date = new Date(value);
				const now = new Date();
				if (date > now)
					return 'La Fecha de nacimiento no puede ser en el futuro';
				return null;
			},
			nota1: value => {
				if (!value) return 'Nota 1 es requerido';
				if (!/^-?\d+$/.test(value))
					return 'Nota 1 debe ser un número entero';
				const nota = parseInt(value, 10);
				if (nota < 0) return 'Nota 1 no puede ser negativo';

				if (nota > 20) return 'Nota 1 debe estar entre 0 y 20';
				return null;
			},

			nota2: value => {
				if (!value) return 'Nota 2 es requerido';
				if (!/^-?\d+$/.test(value))
					return 'Nota 2 debe ser un número entero';
				const nota = parseInt(value, 10);
				if (nota < 0) return 'Nota 2 no puede ser negativo';

				if (nota > 20) return 'Nota 2 debe estar entre 0 y 20';
				return null;
			},

			nota3: value => {
				if (!value) return 'Nota 3 es requerido';
				if (!/^-?\d+$/.test(value))
					return 'Nota 3 debe ser un número entero';
				const nota = parseInt(value, 10);
				if (nota < 0) return 'Nota 3 no puede ser negativo';

				if (nota > 20) return 'Nota 3debe estar entre 0 y 20';
				return null;
			},
			departamento: value => {
				if (!value) return 'El Departamento es requerido';
				if (value.length > 25)
					return 'Departamento muy largo (máx. 25 caracteres)';
				if (/\d/.test(value))
					return 'El Departamento no debe contener números';
				return null;
			},
		},
	});

	useEffect(() => {
		if (dateValue) {
			const formattedDate = dateValue.toISOString().split('T')[0];
			form.setValues({ ...form.values, fecha_nac: formattedDate });
		}
	}, [dateValue]);
	// useEffect(() => {
	// 	if (dateValue) {
	// 		const formattedDate = dateValue.toISOString().split('T')[0];
	// 		form.setValues(prevValues => ({
	// 			...prevValues,
	// 			fecha_nac: formattedDate,
	// 		}));
	// 	}
	// }, [dateValue, form]);

	const openModal = (
		op,
		id,
		nombre,
		apellido_pat,
		apellido_mat,
		fecha_nac,
		nota1,
		nota2,
		nota3,
		departamento,
	) => {
		// setModal(true),
		open();
		setOperation(op);
		form.setValues({
			id: op === 2 ? id : '',
			nombre: nombre,
			apellido_pat: apellido_pat,
			apellido_mat: apellido_mat,
			fecha_nac: fecha_nac,
			nota1: formatGrade(nota1),
			nota2: formatGrade(nota2),
			nota3: formatGrade(nota3),
			departamento: departamento,
		});

		if (op === 1) {
			setTitle('Añadir estudiante');
			setDateValue(null);
		} else {
			setTitle('Editar estudiante');
			setDateValue(fecha_nac ? dayjs(fecha_nac).toDate() : null);
		}
	};
	const closeModal = () => {
		// setModal(false);
		close();
	};

	// const save = e => {
	// 	e.preventDefault();
	// 	if (operation === 1) {
	// 		post(route('estudiantes.store'), {
	// 			// onSuccess: () => {
	// 			// 	ok('Estudiante añadido con éxito');
	// 			// },
	// 			onSuccess: response => {
	// 				// Suponiendo que response.props.estudiante contiene el estudiante añadido
	// 				const nuevoEstudiante = response.props.estudiante;
	// 				setEstudiantes(estudiantesActuales => [
	// 					...estudiantesActuales,
	// 					nuevoEstudiante,
	// 				]);
	// 				setSortedData(sortedDataActuales => [
	// 					...sortedDataActuales,
	// 					nuevoEstudiante,
	// 				]);
	// 				ok('Estudiante añadido con éxito');
	// 			},
	// 			onError: () => {
	// 				if (errors.nombre) {
	// 					reset('nombre');
	// 					NombreInput.current.focus();
	// 				}
	// 				if (errors.apellido_pat) {
	// 					reset('apellido_pat');
	// 					Apellido_Pat_Input.current.focus();
	// 				}
	// 				if (errors.apellido_mat) {
	// 					reset('apellido_mat');
	// 					Apellido_Mat_Input.current.focus();
	// 				}
	// 				if (errors.fecha_nac) {
	// 					reset('fecha_nac');
	// 					Fecha_Nac_Input.current.focus();
	// 				}
	// 				if (errors.nota1) {
	// 					reset('nota1');
	// 					Nota1Input.current.focus();
	// 				}
	// 				if (errors.departamento) {
	// 					reset('departamento');
	// 					DepartamentoInput.current.focus();
	// 				}
	// 			},
	// 		});
	// 	} else {
	// 		put(route('estudiantes.update', data.id), {
	// 			// onSuccess: () => {
	// 			// 	ok('Estudiante actualizado con éxito');
	// 			// },
	// 			onSuccess: response => {
	// 				// Suponiendo que response.props.estudiante contiene el estudiante actualizado
	// 				const estudianteActualizado = response.props.estudiante;
	// 				setEstudiantes(estudiantesActuales =>
	// 					estudiantesActuales.map(est =>
	// 						est.id === estudianteActualizado.id
	// 							? estudianteActualizado
	// 							: est,
	// 					),
	// 				);
	// 				setSortedData(sortedDataActuales =>
	// 					sortedDataActuales.map(est =>
	// 						est.id === estudianteActualizado.id
	// 							? estudianteActualizado
	// 							: est,
	// 					),
	// 				);
	// 				// Actualiza de forma dinámica la página
	// 				// window.history.pushState(
	// 				// 	{},
	// 				// 	'',
	// 				// 	route('estudiantes.index'),
	// 				// );
	// 				ok('Estudiante actualizado con éxito');
	// 			},
	// 			onError: () => {
	// 				if (errors.nombre) {
	// 					reset('nombre');
	// 					NombreInput.current.focus();
	// 				}
	// 				if (errors.apellido_pat) {
	// 					reset('apellido_pat');
	// 					Apellido_Pat_Input.current.focus();
	// 				}
	// 				if (errors.apellido_mat) {
	// 					reset('apellido_mat');
	// 					Apellido_Mat_Input.current.focus();
	// 				}
	// 				if (errors.fecha_nac) {
	// 					reset('fecha_nac');
	// 					Fecha_Nac_Input.current.focus();
	// 				}
	// 				if (errors.nota1) {
	// 					reset('nota1');
	// 					Nota1Input.current.focus();
	// 				}
	// 				if (errors.departamento) {
	// 					reset('departamento');
	// 					DepartamentoInput.current.focus();
	// 				}
	// 			},
	// 		});
	// 	}
	// };
	const save = async values => {
		setIsSubmitting(true);
		try {
			let response;
			const estudianteData = {
				nombre: values.nombre,
				apellido_pat: values.apellido_pat,
				apellido_mat: values.apellido_mat,
				fecha_nac: values.fecha_nac,
				nota1: parseInt(values.nota1, 10), // Asegúrate de enviar un entero
				nota2: parseInt(values.nota2, 10), // Asegúrate de enviar un entero
				nota3: parseInt(values.nota3, 10), // Asegúrate de enviar un entero
				departamento: values.departamento,
			};

			if (operation === 1) {
				// Añadir un nuevo estudiante
				response = await axios.post('/estudiantes', estudianteData);
				const newStudent = response.data.estudiante;
				const updatedStudents = [...estudiantes, newStudent];
				setEstudiantes(updatedStudents);
				setSortedData(updatedStudents);
			} else {
				// Actualizar un estudiante existente
				response = await axios.put(
					`/estudiantes/${values.id}`,
					estudianteData,
				);
				const estudianteActualizado = response.data.estudiante;
				setEstudiantes(estudiantesActuales =>
					estudiantesActuales.map(est =>
						est.id === estudianteActualizado.id
							? estudianteActualizado
							: est,
					),
				);
			}

			setSortedData(actualSortedData =>
				actualSortedData.map(est =>
					est.id === response.data.estudiante.id
						? response.data.estudiante
						: est,
				),
			);
			ok(
				'Estudiante ' +
					(operation === 1 ? 'añadido' : 'actualizado') +
					' con éxito',
			);
			closeModal();
		} catch (error) {
			// Manejo de errores
			console.error('Error en la operación', error);
			// Aquí puedes establecer los errores en el formulario o mostrarlos en la interfaz de usuario
		}
		setIsSubmitting(false);
	};

	const ok = mensaje => {
		// reset();
		closeModal();
		Swal.fire({ title: mensaje, icon: 'success' });
	};
	// const eliminar = (id, nombre) => {
	// 	const alerta = Swal.mixin({ buttonsStyling: true });
	// 	alerta
	// 		.fire({
	// 			title:
	// 				'¿Estás seguro de eliminar el estudiante ' + nombre + '?',
	// 			text: 'Esta operación es irreversible',
	// 			icon: 'question',
	// 			showCancelButton: true,
	// 			// confirmButtonColor:'#3085d6',
	// 			confirmButtonText:
	// 				'<i class="fa-solid fa-check"></i> Sí, eliminar',
	// 			customClass: {
	// 				confirmButton:
	// 					'bg-red-600 border border-transparent text-white hover:bg-red-500 active:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800',
	// 			},
	// 			cancelButtonText: '<i class="fa-solid fa-ban"></i> Cancelar',
	// 		})
	// 		.then(result => {
	// 			if (result.isConfirmed) {
	// 				destroy(route('estudiantes.destroy', id), {
	// 					// onSuccess: () => {
	// 					// 	ok('Estudiante eliminado');
	// 					// },
	// 					onSuccess: () => {
	// 						setEstudiantes(estudiantesActuales =>
	// 							estudiantesActuales.filter(
	// 								est => est.id !== id,
	// 							),
	// 						);
	// 						setSortedData(sortedDataActuales =>
	// 							sortedDataActuales.filter(est => est.id !== id),
	// 						);
	// 						ok('Estudiante eliminado');
	// 					},
	// 				});
	// 			}
	// 		});
	// };

	const eliminar = (id, nombre) => {
		const alerta = Swal.mixin({ buttonsStyling: true });
		alerta
			.fire({
				title: `¿Estás seguro de eliminar el estudiante ${nombre}?`,
				text: 'Esta operación es irreversible',
				icon: 'question',
				showCancelButton: true,
				confirmButtonText:
					'<i class="fa-solid fa-check"></i> Sí, eliminar',
				cancelButtonText: '<i class="fa-solid fa-ban"></i> Cancelar',
				customClass: {
					confirmButton:
						'bg-red-600 border border-transparent text-white hover:bg-red-500 active:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800',
				},
			})
			.then(async result => {
				if (result.isConfirmed) {
					try {
						// Realizar la petición DELETE usando axios
						await axios.delete(`/estudiantes/${id}`);

						// Actualizar el estado para reflejar la eliminación
						setEstudiantes(estudiantesActuales =>
							estudiantesActuales.filter(est => est.id !== id),
						);
						setSortedData(sortedDataActuales =>
							sortedDataActuales.filter(est => est.id !== id),
						);

						// Mostrar confirmación de eliminación
						ok('Estudiante eliminado');
					} catch (error) {
						// Manejar posibles errores aquí
						console.error('Error al eliminar el estudiante', error);
						// Mostrar mensaje de error al usuario
					}
				}
			});
	};

	// Ordenamiento
	const [search, setSearch] = useState('');
	const [sortedData, setSortedData] = useState(estudiantes);
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
			current.length === estudiantes.length
				? []
				: estudiantes.map(item => item.id),
		);

	// //Uso de effect para mantener el ordenamiento de columnas y a la vez recoger datos de forma dinámica
	// useEffect(() => {
	// 	setSortedData(
	// 		sortData(props.estudiantes, {
	// 			sortBy,
	// 			reversed: reverseSortDirection,
	// 			search,
	// 		}),
	// 	);
	// }, [props.estudiantes, sortBy, reverseSortDirection, search]);

	const setSorting = (field: keyof RowData) => {
		const reversed = field === sortBy ? !reverseSortDirection : false;
		setReverseSortDirection(reversed);
		setSortBy(field);
		setSortedData(
			sortData(estudiantes, { sortBy: field, reversed, search }),
		);
	};

	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = event.currentTarget;
		setSearch(value);
		setSortedData(
			sortData(estudiantes, {
				sortBy,
				reversed: reverseSortDirection,
				search: value,
			}),
		);
	};

	const idsToSend = selection.map(id => parseInt(id, 10));

	// useEffect(() => {
	// 	setSortedData(
	// 		sortData(estudiantes, {
	// 			sortBy,
	// 			reversed: reverseSortDirection,
	// 			search,
	// 		}),
	// 	);
	// }, [estudiantes, sortBy, reverseSortDirection, search]);

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
							setEstudiantes(updatedData);
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

	// function formatGrade(grade) {
	// 	if (grade === 0) {
	// 		return '00';
	// 	} else if (grade > 0 && grade < 10) {
	// 		return '0' + grade;
	// 	}
	// 	return grade.toString();
	// }
	function formatGrade(grade) {
		if (grade === null || grade === undefined) {
			return ''; // O manejar de otra manera
		}
		if (grade === 0) {
			return '00';
		} else if (grade > 0 && grade < 10) {
			return '0' + grade;
		}
		return grade.toString();
	}

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
				<Table.Td style={{ whiteSpace: 'nowrap' }}>
					{capitalizeWords(estudiante.nombre)}
				</Table.Td>
				<Table.Td>{capitalizeWords(estudiante.apellido_pat)}</Table.Td>
				<Table.Td>{capitalizeWords(estudiante.apellido_mat)}</Table.Td>
				<Table.Td>
					{dayjs(estudiante.fecha_nac).format('MMMM D, YYYY')}
				</Table.Td>

				<Table.Td>{formatGrade(estudiante.nota1)}</Table.Td>
				<Table.Td>{formatGrade(estudiante.nota2)}</Table.Td>
				<Table.Td>{formatGrade(estudiante.nota3)}</Table.Td>
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
									estudiante.nota2,
									estudiante.nota3,
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

	function capitalizeWords(str: string): string {
		return str.toLowerCase().replace(/(?:^|\s)\S/g, a => {
			return a.toUpperCase();
		});
	}

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

				<div className="mt-6 w-2/4">
					<TextInput
						placeholder="Buscar por cualquier campo"
						mb="md"
						leftSection={
							<IconSearch
								style={{
									width: rem(16),
									height: rem(16),
								}}
								stroke={1.5}
							/>
						}
						value={search}
						onChange={handleSearchChange}
					/>
				</div>
			</div>
			<div className="overflow-auto bg-dark grid v-screen place-items-center pb-6 dark:bg-gray-900">
				{/* <table className="table-auto border border-gray-400 dark:border-gray-700 text-black mx-2"> */}

				<ScrollArea
					// w={1150}
					w={1000}
					h={400}
					onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
					scrollbarSize={6}
					classNames={TableScrollAreaClasses}
					className="mt-3"
				>
					{/* <Table.ScrollContainer minWidth={500}> */}
					{/* <ScrollArea
					// w={500}
					h={400}
					// offsetScrollbars
					onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
					scrollbarSize={6}
					classNames={TableScrollAreaClasses}
				> */}

					<Table highlightOnHover className="mb-3">
						{/* <Table.Thead
							className={cx(TableScrollAreaClasses.header, {
								[TableScrollAreaClasses.scrolled]: scrolled,
							})}
						> */}
						<Table.Tbody
							className={cx(TableScrollAreaClasses.header, {
								[TableScrollAreaClasses.scrolled]: scrolled,
							})}
						>
							<Table.Tr>
								<Table.Th
									style={{
										width: rem(40),
									}}
								>
									<Checkbox
										onChange={toggleAll}
										checked={
											selection.length ===
											estudiantes.length
										}
										indeterminate={
											selection.length > 0 &&
											selection.length !==
												estudiantes.length
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

								<Table.Th
									className="px-2 py-2"
									style={{ whiteSpace: 'nowrap' }}
								>
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
									sorted={sortBy === 'nota2'}
									reversed={reverseSortDirection}
									onSort={() => setSorting('nota2')}
								>
									Nota 2
								</Th>

								<Th
									sorted={sortBy === 'nota3'}
									reversed={reverseSortDirection}
									onSort={() => setSorting('nota3')}
								>
									Nota 3
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
						{/* </Table.Thead> */}

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
											estudiantes && estudiantes[0]
												? Object.keys(estudiantes[0])
														.length
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
						{/* </Table.Thead> */}
					</Table>
					{/* </Table.ScrollContainer> */}
				</ScrollArea>
			</div>

			<Modal
				opened={opened}
				onClose={close}
				title={title}
				classNames={ModalHeaderBodyClasses}
			>
				{/* <DialogModal.Content title={title}> */}

				<ScrollArea
					w={400}
					// w={500}
					h={510}
					onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
					scrollbarSize={2}
					classNames={TableScrollAreaClasses}
				>
					<form
						id="myForm"
						onSubmit={form.onSubmit(save)}
						className="mx-4"
						noValidate
					>
						<div className="mt-6">
							{/* <InputLabel for="nombre" value="Nombres"></InputLabel> */}
							<TextInput
								id="nombre"
								name="nombre"
								label="Nombres"
								{...form.getInputProps('nombre')}
								placeholder="Nombres"
								// ref={NombreInput}
								required
								value={form.values.nombre || ''}
								onChange={e =>
									form.setFieldValue('nombre', e.target.value.toUpperCase())
								}
								spellCheck={false}
								// className="mt-1 block w-full"
								data-autofocus
							/>
							{/* <InputError
							message={errors.nombre}
							className="mt-2"
						></InputError> */}
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
								{...form.getInputProps('apellido_pat')}
								placeholder="Apellido Paterno"
								// ref={Apellido_Pat_Input}
								value={form.values.apellido_pat || ''}
								required
								onChange={e =>
									form.setFieldValue(
										'apellido_pat',
										e.target.value.toUpperCase(),
									)
								}
								spellCheck={false}
								// className="mt-1 block w-full"
							/>

							{/* <InputError
							message={errors.apellido_pat}
							className="mt-2"
						></InputError> */}
						</div>
						<div className="mt-6">
							{/* <InputLabel
							for="apellido_mat"
							value="Apellido Materno"
						></InputLabel> */}
							{/* <TextInput
								id="apellido_mat"
								name="apellido_mat"
								label="Apellido Materno"
								{...form.getInputProps('apellido_mat')}
								placeholder="Apellido Materno"
								// ref={Apellido_Mat_Input}
								value={form.values.apellido_mat || ''}
								required
								onChange={e =>
									form.setFieldValue(
										'apellido_mat',
										e.target.value.toUpperCase,
									)
								}
								spellCheck={false}
								// className="mt-1 block w-full"
							/> */}

							<TextInput
								id="apellido_mat"
								name="apellido_mat"
								label="Apellido Materno"
								{...form.getInputProps('apellido_mat')}
								placeholder="Apellido Materno"
								// ref={Apellido_Pat_Input}
								value={form.values.apellido_mat || ''}
								required
								onChange={e =>
									form.setFieldValue(
										'apellido_mat',
										e.target.value.toUpperCase(),
									)
								}
								spellCheck={false}
								// className="mt-1 block w-full"
							/>

							{/* <InputError
							message={errors.apellido_mat}
							className="mt-2"
						></InputError> */}
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
								{...form.getInputProps('fecha_nac')}
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

							{/* <InputError
							message={errors.fecha_nac}
							className="mt-2"
						></InputError> */}
						</div>
						<div>
							<Flex justify="flex-end">
								<div className="mt-6 mr-5">
									{/* <InputLabel for="nombre" value="Nombres"></InputLabel> */}
									<TextInput
										id="nota1"
										name="nota1"
										label="Nota 1"
										{...form.getInputProps('nota1')}
										placeholder="Nota 1"
										// ref={Nota1Input}
										required
										value={
											form.values.nota1 !== null &&
											form.values.nota1 !== undefined
												? form.values.nota1
												: ''
										}
										onChange={e =>
											form.setFieldValue(
												'nota1',
												e.target.value,
											)
										}
										spellCheck={false}
										// className="mt-1 block w-full"
									/>
								</div>

								<div className="mt-6 mr-5">
									{/* <InputLabel for="nombre" value="Nombres"></InputLabel> */}
									<TextInput
										id="nota2"
										name="nota2"
										label="Nota 2"
										{...form.getInputProps('nota2')}
										placeholder="Nota 2"
										// ref={Nota1Input}
										required
										value={
											form.values.nota2 !== null &&
											form.values.nota2 !== undefined
												? form.values.nota2
												: ''
										}
										onChange={e =>
											form.setFieldValue(
												'nota2',
												e.target.value,
											)
										}
										spellCheck={false}
										// className="mt-1 block w-full"
									/>
								</div>

								<div className="mt-6">
									{/* <InputLabel for="nombre" value="Nombres"></InputLabel> */}
									<TextInput
										id="nota3"
										name="nota3"
										label="Nota 3"
										{...form.getInputProps('nota3')}
										placeholder="Nota 3"
										// ref={Nota1Input}
										required
										value={
											form.values.nota3 !== null &&
											form.values.nota3 !== undefined
												? form.values.nota3
												: ''
										}
										onChange={e =>
											form.setFieldValue(
												'nota3',
												e.target.value,
											)
										}
										spellCheck={false}
										// className="mt-1 block w-full"
									/>
								</div>
							</Flex>
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
								{...form.getInputProps('departamento')}
								placeholder="Departamento"
								data={['Puno', 'Arequipa', 'Lima']}
								// ref={DepartamentoInput}
								required
								value={form.values.departamento || ''}
								// onChange={e =>
								// 	setData('departamento', e.target.value)
								// }
								onChange={value =>
									form.setFieldValue('departamento', value)
								}
							/>

							{/* <InputError message={errors.departamento}
							className="mt-2"
						></InputError> */}
						</div>
					</form>
				</ScrollArea>
				{/* </DialogModal.Content> */}

				{/* <DialogModal.Footer> */}
				<div className="pb-2 pt-7">
					<Flex justify="flex-end">
						{/* <Group mt="xl"> */}
						<SecondaryButton onClick={close} variant="default">
							Cancel
						</SecondaryButton>

						<Button
							type="submit"
							form="myForm"
							disabled={isSubmitting}
							// processing={processing.toString()}
							className="ml-2"
						>
							<i className="fa-solid fa-floppy-disk mr-2"></i>
							Guardar
						</Button>
						{/* </Group> */}
					</Flex>
				</div>
				{/* </DialogModal.Footer> */}
			</Modal>
		</AppLayout>
	);
}
