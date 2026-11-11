import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

type RhumbsUsersState = {
  login: string
  isAuthenticated: boolean
}

const rhumbsUsersInitialState: RhumbsUsersState = {
  login: '',
  isAuthenticated: false,
}

const rhumbsUsersSlice = createSlice({
  name: 'rhumbsUsers',
  initialState: rhumbsUsersInitialState,
  reducers: {
    setRhumbsUser: (state, action: PayloadAction<string>) => {
      state.login = action.payload
      state.isAuthenticated = true
    },
    resetRhumbsUser: () => rhumbsUsersInitialState,
  },
})

export const { setRhumbsUser, resetRhumbsUser } = rhumbsUsersSlice.actions
export const rhumbsUsersReducer = rhumbsUsersSlice.reducer
