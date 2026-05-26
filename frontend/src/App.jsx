import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import SignIn from './pages/SignIn.jsx'
import SignUp from './pages/SignUp.jsx'

const App = () => {
  return (
   <Routes>
    <Route path="/" element={<Navigate to="/signin" replace />} />
    <Route path="/signup" element={<SignUp />} />
    <Route path="/signin" element={<SignIn />} />
   </Routes>
  )
}

export default App