import { AnyAction, configureStore, Store } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query/react'
import { getPersistConfig } from 'redux-deep-persist'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'

import reducer from './reducer'
import { migrate } from './migrate'

const persistConfig = getPersistConfig({
  version: 1,
  key: 'root',
  whitelist: ['user', 'transactions'],
  storage,
  rootReducer: reducer,
  migrate,
})

const persistedReducer = persistReducer(persistConfig, reducer)

function makeStore(preloadedState = undefined) {
  return configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: true,
        immutableCheck: true,
        // BigNumbers are used in state, however you MUST ENSURE they're not persisted.
        // If you don't, you'll get a serialization error hidden in the application.
        serializableCheck: false,
      }),
    devTools: process.env.NODE_ENV === 'development',
    preloadedState,
  })
}

let store: Store<any, AnyAction>

export const getOrCreateStore = (preloadedState = undefined) => {
  let _store = store ?? makeStore(preloadedState)
  const formattedPreloadedState = preloadedState ?? {}

  // After navigating to a page with an initial Redux state, merge that state
  // with the current state in the store, and create a new store
  if (preloadedState && store) {
    _store = makeStore({
      ...store.getState(),
      ...formattedPreloadedState,
    })
    // Reset the current store
    store = makeStore()
  }

  // For SSG and SSR always create a new store
  if (typeof window === 'undefined') return _store

  // Create the store once in the client
  if (!store) store = _store

  return _store
}

store = getOrCreateStore()

export type AppState = ReturnType<typeof persistedReducer>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector

setupListeners(store.dispatch)

export default store

export const persistor = persistStore(store)
