import { configureStore } from '@reduxjs/toolkit'
import userReducer from './redux/reducers/userSlice'
import bugDataResultsReducer from './redux/reducers/bugDataResultsSlice'
import showTableViewReducer from './redux/reducers/showTableViewSlice'
import pquaResultsReducer from './redux/reducers/pquaResultsSlice'

const store = configureStore({
  reducer: {
    bugDataResults: bugDataResultsReducer,
    showTableView: showTableViewReducer,
    pquaResults: pquaResultsReducer
  },
});

export default store;