import { createContext, useContext } from 'react'
import useSwitch from 'hooks/useSwitch'

export const GlobalContext = createContext(null)

export const useGlobalContext = () => {
  return useContext(GlobalContext)
}

const GlobalProvider = ({ children }) => {
  const [isPullMenuOpen, openPullMenu, closePullMenu, togglePullMenu] =
    useSwitch()
  const [
    isPullCommitMenuOpen,
    openPullCommitMenu,
    closePullCommitMenu,
    togglePullCommitMenu,
  ] = useSwitch()

  const values = {
    isPullMenuOpen,
    openPullMenu,
    closePullMenu,
    togglePullMenu,
    isPullCommitMenuOpen,
    openPullCommitMenu,
    closePullCommitMenu,
    togglePullCommitMenu,
  }

  return (
    <GlobalContext.Provider value={values}>{children}</GlobalContext.Provider>
  )
}

export default GlobalProvider
