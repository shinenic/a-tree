import TokenPageGuides from 'components/Guide/TokenPage'
import React from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { SettingModal } from 'components/Setting'
import MainThemeProvider from 'styles/Provider'
import App from 'App'

const queryClient = new QueryClient()

const Main = () => (
  <QueryClientProvider client={queryClient}>
    <MainThemeProvider>
      <TokenPageGuides />
      <App />
      <SettingModal />
    </MainThemeProvider>
  </QueryClientProvider>
)

export default Main
