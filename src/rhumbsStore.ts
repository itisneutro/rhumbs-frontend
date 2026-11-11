import { configureStore } from '@reduxjs/toolkit'
import { rhumbsReducer } from './slices/rhumbsSlice'
import { rhumbsUsersReducer } from './slices/rhumbsUsersSlice'

export const rhumbsStore = configureStore({
  reducer: {
    rhumbs: rhumbsReducer,
    rhumbsUsers: rhumbsUsersReducer,
  },
})

export type RootState = ReturnType<typeof rhumbsStore.getState>
export type AppDispatch = typeof rhumbsStore.dispatch
