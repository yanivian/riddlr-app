import AppTheme from './AppTheme'
import RiddlerPage from './components/RiddlerPage'
import UidProvider from './components/UidProvider'

export default function App() {
  return (
    <AppTheme>
      <UidProvider>
        <RiddlerPage />
      </UidProvider>
    </AppTheme>
  )
}