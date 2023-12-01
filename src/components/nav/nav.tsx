import { ChangeEvent, Fragment, useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRightToBracket } from '@fortawesome/free-solid-svg-icons'
import style from './nav.module.css'

export default function Nav() {
  const [login, setLogin] = useState<boolean>(false)
  const [signup, setSignup] = useState<boolean>(false)
  const [user, setUser] = useState({
    email: '',
    password: ''
  })

  useEffect(() => {
    const nav = document.querySelector('nav')!

    window.addEventListener('scroll', () => {
      if (window.scrollY > 200) {
        nav.style.background = 'white';
        nav.style.height = '80px';
        nav.style.color = 'black';
      } else {
        nav.style.background = 'transparent';
        nav.style.height = '120px';
        nav.style.color = 'white';
      }

      if (window.scrollY > 500) {
        nav.style.borderBottom = 'solid 1px #f7f7f7';
      } else {
        nav.style.borderBottom = 'none';
      }
    })
  }, [])

  const windowController = () => {
    if (login) {
      const body = document.querySelector('body')!
      body.style.overflowY = 'auto'
      setLogin(false)

      return
    }

    const body = document.querySelector('body')!
    body.style.overflowY = 'hidden'
    setLogin(true)
  }

  const submitLogin = () => {
    setLogin(false);
    window.location.href = '/'
  }

  return (
    <Fragment>
      { login ?
        <div className={login ? style.windowContainer : style.windowContainerNormal}>
          <div className={style.window}>
            <form onSubmit={submitLogin}>
              <input type="text" className={style.windowInput} placeholder='dyacode@pmh.codes' value={user.email} onChange={(e: ChangeEvent<HTMLInputElement>) => setUser({ ...user, email: e.target.value })} />
              <input type="password" className={style.windowInput} placeholder='********' value={user.password} onChange={(e: ChangeEvent<HTMLInputElement>) => setUser({ ...user, password: e.target.value })} />
              <button className={style.windowButton} onClick={submitLogin}>로그인</button>
              <div className={style.windowWhy} onClick={() => {  setSignup(true); setLogin(false) }}>회원가입 하러가기</div>
            </form>

          </div>
        </div>
      : null }

      <nav>
        <div className={style.container}>
          <a className={style.navTitle} href="/">Star</a>
          <div className={style.navItems}>
            <div className={style.navItem}>메인</div>
            <div className={style.navItem}>랭킹</div>
            <div className={style.navItem}>비교</div>
            <div className={style.navItem} onClick={windowController}>
              <FontAwesomeIcon icon={faRightToBracket} className={style.icon} />
            </div>
          </div>
        </div>
      </nav>
    </Fragment>
  )
}