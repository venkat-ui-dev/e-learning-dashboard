// store/features/userManagementSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Users {
    id: number;
    name: string;
    role: string;
    status: string;
}

interface UserManagementState {
    users: Users[];
}

const initialState: UserManagementState = {
    users: [],
};

const userManagementSlice = createSlice({
    name: "userManagement",
    initialState,
    reducers: {
        setUsers(state, action: PayloadAction<Users[]>) {
            state.users = action.payload;
        },
        addUser(state, action: PayloadAction<Users>) {
            state.users.push(action.payload);
        },
        updateUser(state, action: PayloadAction<Users>) {
            state.users = state.users.map((user) =>
                user.id === action.payload.id ? action.payload : user
            );
        },
        deleteUser(state, action: PayloadAction<number>) {
            state.users = state.users.filter((user) => user.id !== action.payload);
        },
    },
});

export const { setUsers, addUser, updateUser, deleteUser } = userManagementSlice.actions;
export default userManagementSlice.reducer;
