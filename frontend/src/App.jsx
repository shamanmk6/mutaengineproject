import { useState } from 'react'
import { BrowserRouter,Route,Routes} from 'react-router-dom'
import Signup from './assets/Signup'
import Login from './assets/Login'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path='/register' element={<Signup/>}></Route>
        <Route path='/' element={<Login/>}></Route>
      </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
