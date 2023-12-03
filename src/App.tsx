import { Fragment } from 'react'
import { Route, Routes } from 'react-router-dom'
import './App.css'
import Mainpage from './pages/mainpage/mainpage'
import NotFound from './pages/notfound/notfound'
import Ranking from './pages/ranking/ranking'

function App() {
  return (
    <Fragment>
      <Routes>
        <Route element={<Mainpage />} path='/' />
        <Route element={<Ranking />} path='/ranking' />
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </Fragment>
  )
}

export default App
