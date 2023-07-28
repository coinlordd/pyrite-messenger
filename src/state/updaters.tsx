import ApplicationUpdater from './application/updater'
import MulticallUpdater from './multicall/updater'
import TransactionUpdater from './transactions/updater'

export default function Updaters() {
  return (
    <>
      <ApplicationUpdater />
      <MulticallUpdater />
      <TransactionUpdater />
    </>
  )
}
