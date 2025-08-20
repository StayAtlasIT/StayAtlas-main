import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    isLoggedIn: false,
    role: null, //"user","admin","villa owner"
    userId: null,
    firstName:null,
    lastName:null,
    userPhone: null,
    email: null,
    dob: null,
}
export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers:{
        setUser: (state, action) => {
            state.isLoggedIn = true;
            state.role = action.payload.role;
            state.userId = action.payload._id;
            state.firstName = action.payload.firstName;
            state.lastName = action.payload.lastName;
            state.userPhone = action.payload.phoneNumber;
            state.email = action.payload.email;
            state.dob = action.payload.dob;
        },
        logout: (state) => {
            state.isLoggedIn = false;
            state.role = null;
            state.userId = null;
            state.firstName = null;
            state.lastName = null;
            state.userPhone = null;
            state.email = null;
            state.dob = null;
        },

    }
})

export const { setUser, logout } = authSlice.actions
export default authSlice.reducer