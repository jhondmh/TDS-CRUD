import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../../store';

interface AuthState {
	user: any; // Define mejor tu tipo User
	roles: string[];
	permissions: string[];
}

const initialState: AuthState = {
	user: null,
	roles: [],
	permissions: [],
};

export const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		setUser: (state, action: PayloadAction<any>) => {
			state.user = action.payload;
		},
		setRoles: (state, action: PayloadAction<string[]>) => {
			state.roles = action.payload;
		},
		setPermissions: (state, action: PayloadAction<string[]>) => {
			state.permissions = action.payload;
		},
		// Agrega más reducers según necesites
		logoutt: state => {
			state.user = null;
			state.roles = [];
			state.permissions = [];
		},
	},
});

export const { setUser, setRoles, setPermissions, logoutt } = authSlice.actions;

export const selectUser = (state: RootState) => state.auth.user;
export const selectRoles = (state: RootState) => state.auth.roles;
export const selectPermissions = (state: RootState) => state.auth.permissions;

export default authSlice.reducer;
