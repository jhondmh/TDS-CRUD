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
	keys,
	Checkbox,
	Avatar,
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

import dataDepartamentos from '../../Datos/DataDepartamentos';
import dataProvincias from '../../Datos/DataProvincias';

import Can from '@/Components/Can';

interface RowData {
	name: string;
	paternal: string;
	maternal: string;
	departamento: string;
	provincia: string;
	distrito: string;
	current_address: string;
	dni: string;
	email: string;
	password: string;
	nota1: string;
	nota2: string;
	nota3: string;
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

// function filterData(data: RowData[], search: string) {
// 	const query = search.toLowerCase().trim();
// 	console.log('filterData - data:', data);
// 	console.log('filterData - search:', search);
// 	if (data.length === 0) {
// 		return []; // Retorna un arreglo vacío si no hay datos
// 	}
// 	// return data.filter(item =>
// 	// 	Object.keys(data[0]).some(key =>
// 	// 		String(item[key]).toLowerCase().includes(query),
// 	// 	),
// 	// );
// 	const filteredData = data.filter(item =>
// 		Object.keys(data[0]).some(key =>
// 			String(item[key]).toLowerCase().includes(query),
// 		),
// 	);

// 	console.log('filterData - filteredData:', filteredData);
// 	return filteredData;
// }
function filterData(data, search) {
	const query = search.toLowerCase().trim();
	if (data.length === 0) {
		return []; // Retorna un arreglo vacío si no hay datos
	}
	return data.filter(item =>
		Object.keys(item.user).some(key =>
			String(item.user[key]).toLowerCase().includes(query),
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

// function sortData(data, payload) {
// 	const { sortBy, reversed, search } = payload;

// 	if (!sortBy) {
// 		return filterData(data, search);
// 	}

// 	return filterData(
// 		[...data].sort((a, b) => {
// 			console.log('Valor de a[sortBy]:', a[sortBy]);
// 			console.log('Valor de b[sortBy]:', b[sortBy]);
// 			// Comprueba si el valor es un número
// 			if (!isNaN(a[sortBy]) && !isNaN(b[sortBy])) {
// 				// Ordena como número
// 				return reversed ? b[sortBy] - a[sortBy] : a[sortBy] - b[sortBy];
// 			} else {
// 				// Ordena como cadena
// 				if (reversed) {
// 					return b[sortBy].localeCompare(a[sortBy]);
// 				} else {
// 					return a[sortBy].localeCompare(b[sortBy]);
// 				}
// 			}
// 		}),
// 		search,
// 	);
// }
function sortData(data, payload) {
	const { sortBy, reversed, search } = payload;

	if (!sortBy) {
		return filterData(data, search);
	}

	return filterData(
		[...data].sort((a, b) => {
			const aValue = a.user ? a.user[sortBy] : a[sortBy]; // Accede al valor anidado si existe
			const bValue = b.user ? b.user[sortBy] : b[sortBy]; // Accede al valor anidado si existe

			console.log('Valor de aValue:', aValue);
			console.log('Valor de bValue:', bValue);

			if (aValue === undefined || bValue === undefined) {
				console.error(
					`Error: No se encontró la clave '${sortBy}' en los datos.`,
				);
				return 0;
			}

			// Comprueba si el valor es un número
			if (!isNaN(aValue) && !isNaN(bValue)) {
				// Ordena como número
				return reversed ? bValue - aValue : aValue - bValue;
			} else {
				// Ordena como cadena
				if (reversed) {
					return bValue.localeCompare(aValue);
				} else {
					return aValue.localeCompare(bValue);
				}
			}
		}),
		search,
	);
}

export default function Dashboard(props) {
	const route = useRoute();

	const [estudiantes, setEstudiantes] = useState(props.estudiantes);

	// const estudiantes = props.estudiantes; // Asumiendo que 'estudiantes' es pasado como prop

	// estudiantes.forEach(estudiante => {
	// 	console.log(estudiante.user.dni); // Accede al name del usuario relacionado
	// 	console.log(estudiante.nota1); // Accede a la nota1 del estudiante
	// 	// ... otros campos
	// });

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
	// 	name: '',
	// 	apellido_pat: '',
	// 	apellido_mat: '',
	// 	fecha_nac: '',
	// 	nota1: '',
	// 	departamento: '',
	// });

	const form = useForm({
		initialValues: {
			id: '',
			// user_id: '',
			name: '',
			paternal: '',
			maternal: '',
			fecha_nac: null, // Puede que necesites ajustar esto según tu DatePicker
			departamento: '',
			provincia: '',
			distrito: '',
			current_address: '',
			dni: '',
			email: '',
			password: '',
			nota1: '',
			nota2: '',
			nota3: '',
		},

		validate: {
			name: value => {
				if (!value) return 'El name es requerido';
				if (value.length > 25)
					return 'El Nombre muy largo (máx. 25 caracteres)';
				if (/\d/.test(value)) return 'Nombre no debe contener números';
				return null;
			},
			paternal: value => {
				if (!value) return 'El Apellido Paterno requerido';
				if (value.length > 25)
					return 'Apellido Paterno muy largo (máx. 25 caracteres)';
				if (/\d/.test(value))
					return 'El Apellido Paterno no debe contener números';
				return null;
			},
			maternal: value => {
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
			departamento: value => {
				if (!value) return 'El Departamento es requerido';
				if (value.length > 30)
					return 'Departamento muy largo (máx. 30 caracteres)';
				if (/\d/.test(value))
					return 'El Departamento no debe contener números';
				return null;
			},
			provincia: value => {
				if (!value) return 'La Provincia es requerida';
				if (value.length > 30)
					return 'Provincia muy largo (máx. 30 caracteres)';
				if (/\d/.test(value))
					return 'El Provincia no debe contener números';
				return null;
			},
			distrito: value => {
				if (!value) return 'El Distrito es requerido';
				if (value.length > 30)
					return 'Distrito muy largo (máx. 30 caracteres)';
				if (/\d/.test(value))
					return 'El Distrito no debe contener números';
				return null;
			},

			current_address: value => {
				if (!value) return 'La dirección es requerida';
				if (value.length > 70)
					return 'El Nombre muy largo (máx. 70 caracteres)';
				if (/\d/.test(value)) return 'Nombre no debe contener números';
				return null;
			},
			dni: value => {
				if (!value) return 'El DNI es requerido';
				if (!/^[0-9]{8}$/.test(value))
					return 'El DNI debe tener 8 dígitos numéricos';
				return null;
			},
			email: value => {
				if (!value) return 'El correo electrónico es requerido';
				if (!/\S+@\S+\.\S+/.test(value))
					return 'El correo electrónico no es válido';
				if (value.length > 40)
					return 'El correo electrónico es muy largo (máx. 40 caracteres)';
				return null;
			},
			password: value => {
				if (!value) return 'La contraseña es requerida';
				if (value.length < 8)
					return 'La contraseña es muy corta (mín. 8 caracteres)';
				if (!/[A-Za-z]/.test(value) || !/[0-9]/.test(value))
					return 'La contraseña debe contener letras y números';
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
		// user_id,
		name,
		paternal,
		maternal,
		fecha_nac,
		departamento,
		provincia,
		distrito,
		current_address,
		dni,
		email,
		password,
		nota1,
		nota2,
		nota3,
	) => {
		// setModal(true),

		setDepartamento(departamento);
		setProvincia(provincia);
		setDistrito(distrito);
		open();
		setOperation(op);
		// console.log(user_id);
		form.setValues({
			id: op === 2 ? id : '',
			// user_id: user_id,
			name: name,
			paternal: paternal,
			maternal: maternal,
			fecha_nac: fecha_nac,
			departamento: departamento,
			provincia: provincia,
			distrito: distrito,
			current_address: current_address,
			dni: dni,
			email: email,
			password: password,
			nota1: formatGrade(nota1),
			nota2: formatGrade(nota2),
			nota3: formatGrade(nota3),
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
	// 				if (errors.name) {
	// 					reset('name');
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
	// 				if (errors.name) {
	// 					reset('name');
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
				// user_id: values.user_id,
				name: values.name,
				paternal: values.paternal,
				maternal: values.maternal,
				fecha_nac: values.fecha_nac,
				departamento: values.departamento,
				provincia: values.provincia,
				distrito: values.distrito,
				current_address: values.current_address,
				dni: values.dni,
				email: values.email,
				password: values.password,
				nota1: parseInt(values.nota1, 10), // Asegúrate de enviar un entero
				nota2: parseInt(values.nota2, 10), // Asegúrate de enviar un entero
				nota3: parseInt(values.nota3, 10), // Asegúrate de enviar un entero
			};

			console.log(estudianteData);

			if (operation === 1) {
				// Añadir un nuevo estudiante
				response = await axios.post('/estudiantes', estudianteData);
				const newStudent = response.data.estudiante;
				const updatedStudents = [...estudiantes, newStudent];
				setEstudiantes(updatedStudents);
				setSortedData(updatedStudents);
				window.location.reload();
			} else {
				// Actualizar un estudiante existente
				response = await axios.put(
					`/estudiantes/${values.id}`,
					estudianteData,
				);
				console.log(
					'Respuesta del servidor (Actualizar):',
					response.data,
				);

				const estudianteActualizado = response.data.estudiante;
				setEstudiantes(estudiantesActuales => {
					console.log(
						'Estudiantes antes de actualizar (Actualizar):',
						estudiantesActuales,
					);
					const estudiantesActualizados = estudiantesActuales.map(
						est =>
							est.id === estudianteActualizado.id
								? estudianteActualizado
								: est,
					);
					console.log(
						'Estudiantes actualizados (Actualizar):',
						estudiantesActualizados,
					);
					return estudiantesActualizados;
				});
			}

			setSortedData(actualSortedData => {
				console.log(
					'SortedData antes de actualizar:',
					actualSortedData,
				);
				const newData = actualSortedData.map(est =>
					est.id === response.data.estudiante.id
						? response.data.estudiante
						: est,
				);
				console.log('SortedData actualizados:', newData);
				return newData;
			});
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
	// const eliminar = (id, name) => {
	// 	const alerta = Swal.mixin({ buttonsStyling: true });
	// 	alerta
	// 		.fire({
	// 			title:
	// 				'¿Estás seguro de eliminar el estudiante ' + name + '?',
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

	const eliminar = (id, name) => {
		const alerta = Swal.mixin({ buttonsStyling: true });
		alerta
			.fire({
				title: `¿Estás seguro de eliminar el estudiante ${name}?`,
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
		console.log('Datos antes de ordenar:', estudiantes);
		console.log('Clave de ordenamiento (sortBy):', field);
		console.log('Orden invertido (reverseSortDirection):', reversed);

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
	// console.log(idsToSend);

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
							console.log(updatedData);
							setEstudiantes(updatedData);
							setSortedData(updatedData);
							console.log(selection);
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
		const selected = selection.includes(estudiante.user.id);
		console.log(selected);
		return (
			<Table.Tr
				key={estudiante.id}
				className={cx({
					[TableSelectionClasses.rowSelected]: selected,
				})}
			>
				<Can perform="estudiantes.multipleDestroy">
					<Table.Td>
						<Checkbox
							checked={selection.includes(estudiante.id)}
							onChange={() => toggleRow(estudiante.id)}
						/>
					</Table.Td>
				</Can>
				<Table.Td>{i + 1}</Table.Td>
				<Table.Td style={{ whiteSpace: 'nowrap' }}>
					{capitalizeWords(estudiante.user.name)}
				</Table.Td>
				<Table.Td>{capitalizeWords(estudiante.user.paternal)}</Table.Td>
				<Table.Td>{capitalizeWords(estudiante.user.maternal)}</Table.Td>
				<Table.Td>
					{dayjs(estudiante.user.fecha_nac).format('MMMM D, YYYY')}
				</Table.Td>

				<Table.Td>{estudiante.user.departamento}</Table.Td>
				<Table.Td>{estudiante.user.provincia}</Table.Td>
				<Table.Td>{estudiante.user.distrito}</Table.Td>

				<Table.Td>{estudiante.user.current_address}</Table.Td>
				<Table.Td>{estudiante.user.dni}</Table.Td>
				<Table.Td>{estudiante.user.email}</Table.Td>

				<Table.Td>{formatGrade(estudiante.nota1)}</Table.Td>
				<Table.Td>{formatGrade(estudiante.nota2)}</Table.Td>
				<Table.Td>{formatGrade(estudiante.nota3)}</Table.Td>

				<Can perform="estudiantes.update">
					<Table.Td>
						<div className="flex justify-center items-center w-full h-full">
							<WarningButton
								onClick={() =>
									openModal(
										2,

										estudiante.id,
										// estudiante.user.id,
										// estudiante.user.user_id,
										estudiante.user.name,
										estudiante.user.paternal,
										estudiante.user.maternal,
										estudiante.user.fecha_nac,
										estudiante.user.departamento,
										estudiante.user.provincia,
										estudiante.user.distrito,
										estudiante.user.current_address,
										estudiante.user.dni,
										estudiante.user.email,
										estudiante.user.password,
										estudiante.nota1,
										estudiante.nota2,
										estudiante.nota3,
									)
								}
							>
								<i className="fa-solid fa-pen-to-square"></i>
							</WarningButton>
						</div>
					</Table.Td>
				</Can>

				<Can perform="estudiantes.destroy">
					<Table.Td>
						<div className="flex justify-center items-center w-full h-full">
							<DangerButton
								onClick={() =>
									eliminar(estudiante.id, estudiante.name)
								}
							>
								<i className="fa-solid fa-trash"></i>
							</DangerButton>
						</div>
					</Table.Td>
				</Can>
			</Table.Tr>
		);
	});

	// Lugares
	const [departamento, setDepartamento] = useState(
		estudiantes.departamento || '',
	);
	const [provincia, setProvincia] = useState(estudiantes.provincia || '');
	const [distrito, setDistrito] = useState(estudiantes.distrito || '');

	// // Efecto para inicializar estados al montar el componente
	React.useEffect(() => {
		setDepartamento(estudiantes.departamento || '');
		setProvincia(estudiantes.provincia || '');
		setDistrito(estudiantes.distrito || '');
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
		// form.setData({
		// 	...form.data, // Incluye todas las propiedades actuales
		// 	departamento: value,
		// 	provincia: '',
		// 	distrito: '',
		// });

		form.setValues(currentValues => ({
			...currentValues, // Incluye todas las propiedades actuales
			departamento: value,
			provincia: '',
			distrito: '',
		}));
	};

	const handleProvinciaChange = (value: string) => {
		setProvincia(value);
		setDistrito('');
		// form.setData({
		// 	...form.data, // Incluye todas las propiedades actuales
		// 	provincia: value,
		// 	distrito: '',
		// });
		form.setValues(currentValues => ({
			...currentValues, // Incluye todas las propiedades actuales
			provincia: value,
			distrito: '',
		}));
	};

	const handleDistritoChange = (value: string) => {
		setDistrito(value);
		// form.setData({
		// 	...form.data, // Incluye todas las propiedades actuales
		// 	distrito: value,
		// });
		form.setValues(currentValues => ({
			...currentValues, // Incluye todas las propiedades actuales
			distrito: value,
		}));
	};

	// Obtiene las provincias para el departamento seleccionado
	const provincias = departamento
		? dataDepartamentos[departamento] || []
		: [];

	// Obtiene los distritos para la provincia seleccionada
	const distritos = provincia ? dataProvincias[provincia] || [] : [];
	function capitalizeWords(str: string): string {
		if (!str) return ''; // Retorna una cadena vacía si str es undefined o null
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
					<Can perform="estudiantes.store">
						<PrimaryButton onClick={() => openModal(1)}>
							<i className="fa-solid fa-circle-plus mr-2"></i>
							Añadir
						</PrimaryButton>
					</Can>

					<Can perform="estudiantes.multipleDestroy">
						<PrimaryButton onClick={eliminarMultiples}>
							Eliminar seleccionados
						</PrimaryButton>
					</Can>
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
								<Can perform="estudiantes.multipleDestroy">
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
								</Can>
								<Table.Th className="px-2 py-2">#</Table.Th>
								<Th
									sorted={sortBy === 'name'}
									reversed={reverseSortDirection}
									onSort={() => setSorting('name')}
								>
									Nombres
								</Th>
								<Th
									sorted={sortBy === 'paternal'}
									reversed={reverseSortDirection}
									onSort={() => setSorting('paternal')}
								>
									Apellido Paterno
								</Th>
								<Th
									sorted={sortBy === 'maternal'}
									reversed={reverseSortDirection}
									onSort={() => setSorting('maternal')}
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
									sorted={sortBy === 'departamento'}
									reversed={reverseSortDirection}
									onSort={() => setSorting('departamento')}
								>
									Departamento
								</Th>

								<Th
									sorted={sortBy === 'provincia'}
									reversed={reverseSortDirection}
									onSort={() => setSorting('provincia')}
								>
									Provincia
								</Th>
								<Th
									sorted={sortBy === 'distrito'}
									reversed={reverseSortDirection}
									onSort={() => setSorting('distrito')}
								>
									Distrito
								</Th>

								<Th
									sorted={sortBy === 'current_address'}
									reversed={reverseSortDirection}
									onSort={() => setSorting('current_address')}
								>
									Dirección actual
								</Th>
								<Th
									sorted={sortBy === 'dni'}
									reversed={reverseSortDirection}
									onSort={() => setSorting('dni')}
								>
									DNI
								</Th>
								<Th
									sorted={sortBy === 'email'}
									reversed={reverseSortDirection}
									onSort={() => setSorting('email')}
								>
									Email
								</Th>
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

								<Can perform="estudiantes.update">
									<Table.Th className="px-2 py-2">
										Editar
									</Table.Th>
								</Can>

								<Can perform="estudiantes.destroy">
									<Table.Th className="px-2 py-2">
										Eliminar
									</Table.Th>
								</Can>
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
											Sin resultados
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
							{/* <InputLabel for="name" value="Nombres"></InputLabel> */}
							<TextInput
								id="name"
								name="name"
								label="Nombres"
								{...form.getInputProps('name')}
								placeholder="Nombres"
								// ref={NombreInput}
								required
								value={form.values.name || ''}
								onChange={e =>
									form.setFieldValue(
										'name',
										e.target.value.toUpperCase(),
									)
								}
								spellCheck={false}
								// className="mt-1 block w-full"
								data-autofocus
							/>
						</div>
						<div className="mt-6">
							{/* <InputLabel
							for="paternal"
							value="Apellido Paterno"
						></InputLabel> */}
							<TextInput
								id="paternal"
								name="paternal"
								label="Apellido Paterno"
								{...form.getInputProps('paternal')}
								placeholder="Apellido Paterno"
								// ref={Apellido_Pat_Input}
								value={form.values.paternal || ''}
								required
								onChange={e =>
									form.setFieldValue(
										'paternal',
										e.target.value.toUpperCase(),
									)
								}
								spellCheck={false}
								// className="mt-1 block w-full"
							/>

							{/* <InputError
							message={errors.paternal}
							className="mt-2"
						></InputError> */}
						</div>
						<div className="mt-6">
							{/* <InputLabel
							for="maternal"
							value="Apellido Materno"
						></InputLabel> */}
							<TextInput
								id="maternal"
								name="maternal"
								label="Apellido Materno"
								{...form.getInputProps('maternal')}
								placeholder="Apellido Materno"
								// ref={Apellido_Mat_Input}
								value={form.values.maternal || ''}
								required
								onChange={e =>
									form.setFieldValue(
										'maternal',
										e.target.value.toUpperCase(),
									)
								}
								spellCheck={false}
								// className="mt-1 block w-full"
							/>

							{/* <InputError
							message={errors.maternal}
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

						<div className="mt-6">
							<Select
								key={`departamento-${departamento}`}
								id="departamento"
								name="departamento"
								label="Departamento"
								{...form.getInputProps('departamento')}
								placeholder="Departamento"
								// data={['Puno', 'Arequipa', 'Lima']}

								data={Object.keys(dataDepartamentos)}
								// ref={DepartamentoInput}
								required
								// value={form.values.departamento || ''}

								value={departamento || ''}
								// onChange={e =>
								// 	setData('departamento', e.target.value)
								// }
								// onChange={value =>
								// 	form.setFieldValue('departamento', value)
								// }

								onChange={(value: string) =>
									handleDepartamentoChange(value)
								}
								searchable
								nothingFoundMessage="No se ha encontrado nada..."
								clearable
								comboboxProps={{
									dropdownPadding: 13,
									transitionProps: {
										transition: 'pop',
										duration: 200,
									},
								}}
							/>
						</div>

						<div className="mt-6">
							<Select
								key={`provincia-${provincia}`}
								id="provincia"
								name="provincia"
								label="Provincia"
								{...form.getInputProps('provincia')}
								placeholder="Provincia"
								// data={['Puno', 'Arequipa', 'Lima']}

								data={provincias}
								// ref={DepartamentoInput}
								required
								// value={form.values.provincia || ''}

								value={provincia || ''}
								// onChange={e =>
								// 	setData('provincia', e.target.value)
								// }
								// onChange={value =>
								// 	form.setFieldValue('provincia', value)
								// }

								onChange={(value: string) =>
									handleProvinciaChange(value)
								}
								searchable
								nothingFoundMessage="No se ha encontrado nada..."
								clearable
								comboboxProps={{
									dropdownPadding: 13,
									transitionProps: {
										transition: 'pop',
										duration: 200,
									},
								}}
							/>
						</div>
						<div className="mt-6">
							<Select
								key={`distrito-${distrito}`}
								id="distrito"
								name="distrito"
								label="Distrito"
								{...form.getInputProps('distrito')}
								placeholder="Distrito"
								// data={['Puno', 'Arequipa', 'Lima']}

								data={distritos}
								// ref={DepartamentoInput}
								required
								// value={form.values.distrito || ''}

								value={distrito || ''}
								// onChange={e =>
								// 	setData('distrito', e.target.value)
								// }
								// onChange={value =>
								// 	form.setFieldValue('distrito', value)
								// }
								onChange={(value: string) =>
									handleDistritoChange(value)
								}
								searchable
								nothingFoundMessage="No se ha encontrado nada..."
								clearable
								comboboxProps={{
									dropdownPadding: 13,
									transitionProps: {
										transition: 'pop',
										duration: 200,
									},
								}}
							/>
						</div>

						<div className="mt-6">
							{/* <InputLabel for="name" value="Nombres"></InputLabel> */}
							<TextInput
								id="current_address"
								name="current_address"
								label="Dirección actual"
								{...form.getInputProps('current_address')}
								placeholder="Dirección actual"
								// ref={NombreInput}
								required
								value={form.values.current_address || ''}
								onChange={e =>
									form.setFieldValue(
										'current_address',
										e.target.value,
									)
								}
								spellCheck={false}
								// className="mt-1 block w-full"
							/>
						</div>

						<div className="mt-6">
							{/* <InputLabel
							for="paternal"
							value="Apellido Paterno"
						></InputLabel> */}
							<TextInput
								id="dni"
								name="dni"
								label="DNI"
								{...form.getInputProps('dni')}
								placeholder="DNI"
								// ref={Apellido_Pat_Input}
								value={form.values.dni || ''}
								required
								onChange={e =>
									form.setFieldValue('dni', e.target.value)
								}
								maxLength={8}
								spellCheck={false}
								// className="mt-1 block w-full"
							/>

							{/* <InputError
							message={errors.paternal}
							className="mt-2"
						></InputError> */}
						</div>

						<div className="mt-6">
							{/* <InputLabel
							for="paternal"
							value="Apellido Paterno"
						></InputLabel> */}
							<TextInput
								id="email"
								name="email"
								label="Email"
								{...form.getInputProps('email')}
								placeholder="Email"
								// ref={Apellido_Pat_Input}
								value={form.values.email || ''}
								required
								onChange={e =>
									form.setFieldValue('email', e.target.value)
								}
								spellCheck={false}
								// className="mt-1 block w-full"
							/>

							{/* <InputError
							message={errors.paternal}
							className="mt-2"
						></InputError> */}
						</div>

						<div className="mt-6 mb-2">
							{/* <InputLabel
							for="paternal"
							value="Apellido Paterno"
						></InputLabel> */}
							<TextInput
								id="password"
								name="password"
								label="Contraseña"
								{...form.getInputProps('password')}
								placeholder="Contraseña"
								// ref={Apellido_Pat_Input}
								value={form.values.password || ''}
								required
								onChange={e =>
									form.setFieldValue(
										'password',
										e.target.value,
									)
								}
								spellCheck={false}
								// className="mt-1 block w-full"
								type="password"
							/>

							{/* <InputError
							message={errors.paternal}
							className="mt-2"
						></InputError> */}
						</div>
						<div>
							<Flex justify="flex-end">
								<div className="mt-6 mr-5">
									{/* <InputLabel for="name" value="Nombres"></InputLabel> */}
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
									{/* <InputLabel for="name" value="Nombres"></InputLabel> */}
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
									{/* <InputLabel for="name" value="Nombres"></InputLabel> */}
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
