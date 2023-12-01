import './App.css'
import { Route, Routes } from 'react-router-dom'
import Mainpage from './pages/mainpage/mainpage'
import Nav from './components/nav/nav'
import { Fragment } from 'react'
import Footer from './components/footer/footer'

function App() {
  return (
    <Fragment>
      <Nav />

      <Routes>

        <Route element={<Mainpage />} path='/' />
      </Routes>

      <Footer />
    </Fragment>
  )
}

export default App
