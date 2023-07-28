import { combineReducers } from '@reduxjs/toolkit'

import application from './application/reducer'
import connection from './connection/reducer'
import multicall from './multicall/reducer'
import transactions from './transactions/reducer'
import user from './user/reducer'

const reducer = combineReducers({
  application,
  connection,
  multicall: multicall.reducer,
  transactions,
  user,
})

export default reducer
