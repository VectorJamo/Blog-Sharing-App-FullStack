import {useState, useEffect} from 'react'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'

import Homepage from './Homepage'
import Login from './Login'
import Register from './Register'
import Blogs from './Blogs'

import './styles/Homepage.css'
import './styles/Form.css'
import './styles/Main.css'
import './styles/Blogs.css'

export default function App() {
  return (
      <Router>
        <Routes>
          <Route path='/' element={<Homepage />}></Route>
          <Route path='/login' element={<Login />}></Route>
          <Route path='/register' element={<Register />}></Route>
          <Route path='/blogs' element={<Blogs />}></Route>
        </Routes>
      </Router>
  )
}