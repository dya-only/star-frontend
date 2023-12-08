import { Fragment } from 'react'
import style from './notfound.module.css'
import Nav from '../../components/nav/nav'

export default function NotFound () {
  return (
    <Fragment>
      <Nav type={'contain'} />

      <div className={style.main}>
        <h1>404</h1>
      </div>
    </Fragment>
  )
}