import { Outlet } from 'react-router-dom'
import StyleSheet from './App.module.css'

function App() {
  return <div className={StyleSheet.App}>
    <Outlet />
  </div>
}

export default App
