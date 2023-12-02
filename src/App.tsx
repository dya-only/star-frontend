import { Fragment } from 'react'
import { Route, Routes } from 'react-router-dom'
import './App.css'
import Nav from './components/nav/nav'
import Mainpage from './pages/mainpage/mainpage'
import NotFound from './pages/notfound/notfound'

function App() {
  return (
    <Fragment>
      <Nav />

      <Routes>
        <Route element={<Mainpage />} path='/' />
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </Fragment>
  )
}

export default App
