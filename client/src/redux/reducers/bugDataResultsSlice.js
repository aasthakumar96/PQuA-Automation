import { createSlice } from '@reduxjs/toolkit'

export const bugDataResultsSlice = createSlice({
  name: 'bugDataResults',
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

export const { addResults, removeResults } = bugDataResultsSlice.actions

export const selectBugDataResults = state => state.bugDataResults.value

export default bugDataResultsSlice.reducer