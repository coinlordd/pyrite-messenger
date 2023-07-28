import { createMigrate, MigrationManifest, PersistedState, PersistState } from 'redux-persist'

import { ApplicationState } from './application/reducer'
import { ConnectionState } from './connection/reducer'
import { TransactionState } from './transactions/reducer'
import { UserState } from './user/reducer'

type RootAppState = {
  application: ApplicationState
  connection: ConnectionState
  transactions: TransactionState
  user: UserState
}

type PersistAppStateV0 = RootAppState & {
  _persist: PersistState
}

const migrations: MigrationManifest = {
  0: (state: PersistedState): PersistAppStateV0 | undefined => {
    return state as PersistAppStateV0
  },
}

export const migrate = createMigrate(migrations, { debug: false })
