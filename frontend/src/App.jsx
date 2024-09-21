import { useState } from 'react'
import { BrowserRouter,Route,Routes} from 'react-router-dom'
import Signup from './assets/Signup'
import Login from './assets/Login'
import Home from './assets/Home'
import Invoice from './assets/Invoice'
import ForgotPassword from './assets/ForgotPassword'
import EnterOtp from './assets/EnterOtp'
import ChangePassword from './assets/ChangePassword'
import ProtectedRoute from './assets/ProtectedRoute'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path='/register' element={<Signup/>}></Route>
        <Route path='/' element={<Login/>}></Route>
        <Route path='/login' element={<Login/>}></Route>
        <Route path='/home' element={ <ProtectedRoute><Home/></ProtectedRoute>}></Route>
        <Route path='/invoice' element={ <ProtectedRoute><Invoice/></ProtectedRoute>}></Route>
        <Route path='/forgot-password' element={<ForgotPassword/>}></Route>
        <Route path='/enter-otp' element={<EnterOtp/>}></Route>
        <Route path='/change-password' element={<ChangePassword/>}></Route>
      </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
