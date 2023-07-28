import { createSlice } from '@reduxjs/toolkit'
import { ConnectionType } from '~/connection/types'

export interface UserState {
  selectedWallet?: ConnectionType
}

const initialState: UserState = {
  selectedWallet: undefined,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateSelectedWallet(
      state,
      {
        payload,
      }: {
        payload: ConnectionType | undefined
      }
    ) {
      state.selectedWallet = payload
    },
  },
})

export const { updateSelectedWallet } = userSlice.actions
export default userSlice.reducer
