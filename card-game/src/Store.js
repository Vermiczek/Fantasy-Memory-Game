import {configureStore } from '@reduxjs/toolkit';
import appReducer from './redux.js'

export default configureStore({
    reducer: appReducer,
  })
