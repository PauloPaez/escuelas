import { useState } from 'react'
import { Provider } from 'react-redux'
import { store } from './store/store'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PlanillaDocentes from './components/PlanillaDocentes'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Provider store={store}>
      <PlanillaDocentes />
      <ToastContainer />
    </Provider>
  )
}

export default App
