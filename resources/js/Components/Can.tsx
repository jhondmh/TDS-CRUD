import React, { ReactNode } from 'react';
import { useAuth } from '@/Contexts/AuthContext';

type CanProps = {
	perform: string; // El permiso que se requiere para renderizar el componente hijo
	children: ReactNode; // Los componentes hijos que se renderizarán si se tiene el permiso
};

const Can = ({ perform, children }: CanProps) => {
	const { permissions } = useAuth();
	console.log('permissions de can.tsx', permissions);
	return permissions.includes(perform) ? <>{children}</> : null;
};

export default Can;
