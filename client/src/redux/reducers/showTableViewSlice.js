import { createSlice } from '@reduxjs/toolkit'

export const showTableViewSlice = createSlice({
  name: 'showTableView',
  initialState: {
    value: {
      pquaTableView: false,
      bugDataTableView: false,
    }
  },
  reducers: {
    showPquaTableView: state => {
        state.value.pquaTableView = true;    
    },
    hidePquaTableView: state => {
        state.value.pquaTableView = false;
    },
    showBugDataTableView: state => {
        state.value.bugDataTableView = true;
    },
    hideBugDataTableView: state => {
        state.value.bugDataTableView = false;
    }
  }
})

export const { showPquaTableView, hidePquaTableView, showBugDataTableView, hideBugDataTableView } = showTableViewSlice.actions

export const selectTableView = state => state.user.value

export default showTableViewSlice.reducer