// import React, { ReactNode } from 'react';
// import { useAuth } from '@/Contexts/AuthContext';

// type CanProps = {
// 	perform: string; // El permiso que se requiere para renderizar el componente hijo
// 	children: ReactNode; // Los componentes hijos que se renderizarán si se tiene el permiso
// };

// const Can = ({ perform, children }: CanProps) => {
// 	const { permissions } = useAuth();
// 	console.log('permissions de can.tsx', permissions);
// 	return permissions.includes(perform) ? <>{children}</> : null;
// };

// export default Can;

import React, { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { selectPermissions } from '../store/features/auth/authSlice';

type CanProps = {
	perform: string; // El permiso que se requiere para renderizar el componente hijo
	children: ReactNode; // Los componentes hijos que se renderizarán si se tiene el permiso
};

const Can = ({ perform, children }: CanProps) => {
	// Obtener los permisos del estado de Redux
	const permissions = useSelector(selectPermissions);
	console.log('permissions de can.tsx', permissions);

	// Renderizar los hijos solo si el usuario tiene el permiso requerido
	return permissions.includes(perform) ? <>{children}</> : null;
};

export default Can;
