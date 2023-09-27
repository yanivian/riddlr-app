import AppTheme from './AppTheme'
import RiddlrPage from './components/RiddlrPage'
import UidProvider from './components/UidProvider'

export default function App() {
  return (
    <AppTheme>
      <UidProvider>
        <RiddlrPage />
      </UidProvider>
    </AppTheme>
  )
}