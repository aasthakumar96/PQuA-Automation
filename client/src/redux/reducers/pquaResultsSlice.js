import { createSlice } from '@reduxjs/toolkit'

export const pquaResultsSlice = createSlice({
  name: 'pquaResults',
  initialState: {
    value: []
  },
  reducers: {
    addResults: (state, action) => {
      state.value.push(action.payload);  
    },
    removeResults: state => {
        while(state.value.length > 0)
            state.value.pop();
    }
  }
})

export const { addResults, removeResults } = pquaResultsSlice.actions

export const selectPquaResults = state => state.pquaResults.value

export default pquaResultsSlice.reducer