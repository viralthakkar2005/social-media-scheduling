import { Router,Route, Routes } from 'react-router-dom'


import './App.css'
import Home from './pages/Home'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import NotFound from './pages/NotFound'



function App() {

  return (
  <>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/sign-in' element={<SignIn/>}/>
      <Route path='/sign-up' element={<SignUp/>}/>
      <Route path="*" element={<NotFound />} />
    </Routes>
  </>
  )
}

export default App
