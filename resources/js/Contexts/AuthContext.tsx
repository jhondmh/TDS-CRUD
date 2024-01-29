// import React, {
// 	createContext,
// 	useContext,
// 	useState,
// 	ReactNode,
// 	FunctionComponent,
// } from 'react';

// type AuthContextType = {
// 	roles: string[];
// 	permissions: string[];
// 	setAuthData: (roles: string[], permissions: string[]) => void;
// };

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const useAuth = () => {
// 	const context = useContext(AuthContext);
// 	if (context === undefined) {
// 		throw new Error('useAuth must be used within a AuthProvider');
// 	}
// 	return context;
// };

// type AuthProviderProps = {
// 	children: ReactNode;
// };

// export const AuthProvider: FunctionComponent<
// 	AuthProviderProps & { initialRoles: string[]; initialPermissions: string[] }
// > = ({ children, initialRoles, initialPermissions }) => {
// 	const [roles, setRoles] = useState<string[]>(initialRoles);
// 	const [permissions, setPermissions] =
// 		useState<string[]>(initialPermissions);

// 	const setAuthData = (newRoles: string[], newPermissions: string[]) => {
// 		setRoles(newRoles);
// 		setPermissions(newPermissions);
// 	};

// 	return (
// 		<AuthContext.Provider value={{ roles, permissions, setAuthData }}>
// 			{children}
// 		</AuthContext.Provider>
// 	);
// };

// ==========================================================
// import React, {
// 	createContext,
// 	useContext,
// 	useState,
// 	ReactNode,
// 	FunctionComponent,
// 	useEffect,
// } from 'react';

// type AuthContextType = {
// 	roles: string[];
// 	permissions: string[];
// 	setAuthData: (roles: string[], permissions: string[]) => void;
// };

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const useAuth = () => {
// 	const context = useContext(AuthContext);
// 	if (context === undefined) {
// 		throw new Error('useAuth must be used within a AuthProvider');
// 	}
// 	return context;
// };

// // type AuthProviderProps = {
// // 	children: ReactNode;
// // 	initialRoles: string[];
// // 	initialPermissions: string[];
// // };
// type AuthProviderProps = {
// 	children: ReactNode;
// 	auth: {
// 		roles: string[];
// 		permissions: string[];
// 	};
// };

// // export const AuthProvider: FunctionComponent<AuthProviderProps> = ({
// // 	children,
// // 	initialRoles,
// // 	initialPermissions,
// // }) => {
// // 	const [roles, setRoles] = useState<string[]>(initialRoles);
// // 	const [permissions, setPermissions] =
// // 		useState<string[]>(initialPermissions);

// // 	useEffect(() => {
// // 		setRoles(initialRoles);
// // 		setPermissions(initialPermissions);
// // 	}, [initialRoles, initialPermissions]);

// // 	const setAuthData = (newRoles: string[], newPermissions: string[]) => {
// // 		setRoles(newRoles);
// // 		setPermissions(newPermissions);
// // 	};

// // 	return (
// // 		<AuthContext.Provider value={{ roles, permissions, setAuthData }}>
// // 			{children}
// // 		</AuthContext.Provider>
// // 	);
// // };

// export const AuthProvider: FunctionComponent<AuthProviderProps> = ({
// 	children,
// 	auth,
// }) => {
// 	const [roles, setRoles] = useState<string[]>(auth.roles);
// 	const [permissions, setPermissions] = useState<string[]>(auth.permissions);

// 	useEffect(() => {
// 		setRoles(auth.roles);
// 		setPermissions(auth.permissions);
// 	}, [auth.roles, auth.permissions]);

// 	const setAuthData = (newRoles: string[], newPermissions: string[]) => {
// 		setRoles(newRoles);
// 		setPermissions(newPermissions);
// 	};

// 	return (
// 		<AuthContext.Provider value={{ roles, permissions, setAuthData }}>
// 			{children}
// 		</AuthContext.Provider>
// 	);
// };

// ==========================================================

import React, {
	createContext,
	useContext,
	useState,
	ReactNode,
	FunctionComponent,
	useEffect,
} from 'react';

type AuthContextType = {
	roles: string[];
	permissions: string[];
	setAuthData: (roles: string[], permissions: string[]) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error('useAuth must be used within a AuthProvider');
	}
	return context;
};

type AuthProviderProps = {
	children: ReactNode;
	auth: {
		roles: string[];
		permissions: string[];
	};
};

export const AuthProvider: FunctionComponent<AuthProviderProps> = ({
	children,
	auth,
}) => {
	const [roles, setRoles] = useState<string[]>(auth.roles);
	const [permissions, setPermissions] = useState<string[]>(auth.permissions);

	useEffect(() => {
		console.log(
			'Actualizando roles y permisos',
			auth.roles,
			auth.permissions,
		);

		setRoles(auth.roles);
		setPermissions(auth.permissions);
	}, [auth.roles, auth.permissions]);

	const setAuthData = (newRoles: string[], newPermissions: string[]) => {
		setRoles(newRoles);
		setPermissions(newPermissions);
	};

	return (
		<AuthContext.Provider value={{ roles, permissions, setAuthData }}>
			{children}
		</AuthContext.Provider>
	);
};
