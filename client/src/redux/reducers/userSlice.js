import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    value: {
      name: "",
      ldap: "",
      email: ""
    }
  },
  reducers: {
    setUser: (state, action) => {
      state.value.name = action.payload.name;    
      state.value.ldap = action.payload.ldap;    
      state.value.email = action.payload.email;    
    },
    removeUser: state => {
      state.value.name = null;
      state.value.ldap = null;
      state.value.email = null;
    }
  }
})

export const { setUser, removeUser } = userSlice.actions

export const selectUser = state => state.user.value

export default userSlice.reducer