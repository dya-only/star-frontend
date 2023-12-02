import { ChangeEvent, FormEvent, Fragment, useEffect, useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faRightToBracket, faXmark } from '@fortawesome/free-solid-svg-icons'
import style from './nav.module.css'
import axios from 'axios'

export default function Nav() {
  const [status, setStatus] = useState<string>('')
  const [user, setUser] = useState({
    email: '',
    password: ''
  })
  const [profile, setProfile] = useState({
    email: '',
    githubId: '',
    stars: 0,
    isRanking: false,
    image: ''
  })

  const errRef = useRef<HTMLDivElement>(null)
  const loginRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    verify()
    navAnimation()
  }, [])

  const verify = () => {
    axios.get('/api/user/@me', {
      headers: {
        'Authorization': sessionStorage.getItem('TOKEN')
      }
    }).then(resp => {
      console.log(resp.data)
      setProfile(resp.data)
      loginRef.current?.style.setProperty('display', 'none')
      profileRef.current?.style.setProperty('display', 'block')

    }).catch(_ => {
      loginRef.current?.style.setProperty('display', 'block')
      profileRef.current?.style.setProperty('display', 'none')
    })
  }

  const navAnimation = () => {
    const nav = document.querySelector('nav')!

    window.addEventListener('scroll', () => {
      if (window.scrollY > 200) {
        nav.style.background = 'rgba(255, 255, 255, 0.9)'
        nav.style.height = '80px'
        nav.style.color = 'black'
        nav.style.backdropFilter = 'blur(20px)'
      } else {
        nav.style.background = 'transparent'
        nav.style.height = '120px'
        nav.style.color = 'white'
        nav.style.backdropFilter = 'none'
      }

      if (window.scrollY > 500) {
        nav.style.borderBottom = 'solid 1px #f7f7f7'
      } else {
        nav.style.borderBottom = 'none'
      }
    })
  }

  const windowController = () => {
    if (status !== '') {
      const body = document.querySelector('body')!
      body.style.overflowY = 'auto'
      setStatus('')
      return
    }

    const body = document.querySelector('body')!
    body.style.overflowY = 'hidden'
    setStatus('login')
  }

  const submitLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    axios.post('/api/user/by-pass', user, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(resp => {
      sessionStorage.setItem('TOKEN', resp.data.token)
      window.location.href = '/'
    }).catch(_ => {
      errRef.current?.style.setProperty('transform', 'translateY(0)')

      setTimeout(() => {
        errRef.current!.style.setProperty('transform', 'translateY(-100px)')
      }, 2000)
    })
  }

  return (
    <Fragment>
      <div ref={errRef} className={style.errContainer}>
        <div className={style.err}>
          <div className={style.checkContainer}>
            <FontAwesomeIcon className={style.checkIcon} icon={faXmark} />
            <div className={style.checkBg} />
          </div>

          <div className={style.errMsg}>아이디, 비밀번호를 확인해주세요.</div>
        </div>
      </div>

      {status === 'login' ?
        <div className={style.windowContainer}>
          <div className={style.window}>
            <form onSubmit={submitLogin}>
              <input type="text" className={style.windowInput} placeholder='dyacode@pmh.codes' value={user.email} onChange={(e: ChangeEvent<HTMLInputElement>) => setUser({ ...user, email: e.target.value })} />
              <input type="password" className={style.windowInput} placeholder='********' value={user.password} onChange={(e: ChangeEvent<HTMLInputElement>) => setUser({ ...user, password: e.target.value })} />
              <button type='submit' className={style.windowButton}>로그인</button>
              <div className={style.windowUp} onClick={() => setStatus('signup')}>회원가입</div>
            </form>
          </div>
        </div>
        : null}

      <nav>
        <div className={style.container}>
          <a className={style.navTitle} href="/">Star</a>
          <div className={style.navItems}>
            <div className={style.navItem}>메인</div>
            <div className={style.navItem}>랭킹</div>
            <div className={style.navItem}>비교</div>
            <div ref={loginRef} className={style.navItem} onClick={windowController}>
              <FontAwesomeIcon icon={faRightToBracket} className={style.icon} />
            </div>
            <div ref={profileRef} className={style.navItem}>
              <img className={style.profileImg} src={`/api/image/user/${profile.image}`} alt="" />
            </div>
          </div>
        </div>
      </nav>
    </Fragment>
  )
}