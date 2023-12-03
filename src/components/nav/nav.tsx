import { ChangeEvent, FormEvent, Fragment, useEffect, useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faRightToBracket, faXmark } from '@fortawesome/free-solid-svg-icons'
import style from './nav.module.css'
import axios from 'axios'
import { Link } from 'react-router-dom'

import Default from '../../assets/imgs/default.png'

export default function Nav(props: { type: string }) {
  const [status, setStatus] = useState<string>('')
  const [user, setUser] = useState({
    email: '',
    password: '',
    githubId: ''
  })
  const [profile, setProfile] = useState({
    email: '',
    githubId: '',
    stars: 0,
    isRanking: false,
    image: ''
  })
  const [msgValue, setMsgValue] = useState({
    status: false,
    value: ''
  })
  const [uploadImg, setUploadImg] = useState<any>()
  const [sendImg, setSendImg] = useState<any>()

  const msgRef = useRef<HTMLDivElement>(null)
  const loginRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)
  const profileImgRef = useRef<HTMLImageElement>(null)
  const imageRef = useRef<HTMLInputElement>(null)

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

    nav.style.background = 'transparent'
    nav.style.height = '120px'
    nav.style.color = 'white'
    nav.style.backdropFilter = 'none'
    nav.style.borderBottom = 'none'

    if (props.type === 'contain') {
      setTimeout(() => {
        nav.style.background = 'rgba(255, 255, 255, 0.9)'
        nav.style.height = '80px'
        nav.style.color = 'black'
        nav.style.backdropFilter = 'blur(20px)'
        nav.style.borderBottom = 'solid 1px #f7f7f7'
      }, 10)
      return
    }

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

    axios.post('/api/user/by-pass', {
      email: user.email,
      password: user.password
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(resp => {
      sessionStorage.setItem('TOKEN', resp.data.token)
      window.location.href = '/'
    }).catch(_ => {
      setMsgValue({ status: false, value: '이메일, 비밀번호를 확인해주세요.' })

      msgRef.current?.style.setProperty('transform', 'translateY(0)')
      setTimeout(() => {
        msgRef.current!.style.setProperty('transform', 'translateY(-100px)')
      }, 2000)
    })
  }

  const submitSignup = () => {
    if (user.email === '' || user.password === '' || user.githubId === '') {
      setMsgValue({ status: false, value: '모든 정보를 입력해주세요.' })

      msgRef.current?.style.setProperty('transform', 'translateY(0)')
      setTimeout(() => {
        msgRef.current!.style.setProperty('transform', 'translateY(-100px)')
      }, 2000)

      return
    }

    const formData = new FormData()
    formData.append('email', user.email)
    formData.append('password', user.password)
    formData.append('githubId', user.githubId)
    formData.append('image', sendImg)

    axios.post('/api/user', formData, {
      headers: {
        'Content-Type': 'x-www-form-urlencoded'
      }
    }).then(_ => {
      setStatus('login')
      setMsgValue({ status: true, value: '성공적으로 회원가입되었습니다.' })

      msgRef.current?.style.setProperty('transform', 'translateY(0)')
      setTimeout(() => {
        msgRef.current!.style.setProperty('transform', 'translateY(-100px)')
      }, 2000)

      setUser({
        email: '',
        password: '',
        githubId: ''
      })
      setUploadImg(null)
      setSendImg(null)
    }).catch(_ => {
      setMsgValue({ status: false, value: '문제가 발생하였습니다.' })

      msgRef.current?.style.setProperty('transform', 'translateY(0)')
      setTimeout(() => {
        msgRef.current!.style.setProperty('transform', 'translateY(-100px)')
      }, 2000)
    })
  }

  return (
    <Fragment>
      <div ref={msgRef} className={style.msgContainer}>
        <div className={style.msg}>
          <div className={style.checkContainer}>
            <FontAwesomeIcon className={style.checkIcon} icon={msgValue.status ? faCheck : faXmark} />
            <div className={style.checkBg} style={msgValue.status ? { background: '#7fec91' } : { background: 'rgb(255, 100, 100)' }} />
          </div>

          <div className={style.msgText}>{msgValue.value}</div>
        </div>
      </div>

      {status === 'login' ?
        <div className={style.windowContainer}>
          <div className={style.windowForLogin}>
            <form onSubmit={submitLogin}>
              <input type="text" className={style.windowInput} placeholder='dyacode@pmh.codes' value={user.email} onChange={(e: ChangeEvent<HTMLInputElement>) => setUser({ ...user, email: e.target.value })} />
              <input type="password" className={style.windowInput} placeholder='********' value={user.password} onChange={(e: ChangeEvent<HTMLInputElement>) => setUser({ ...user, password: e.target.value })} />
              <button type='submit' className={style.windowButton}>로그인</button>
              <div className={style.windowUp} onClick={() => setStatus('signup')}>회원가입</div>
            </form>
          </div>
        </div>
        : (status === 'signup' ?
          <div className={style.windowContainer}>
            <div className={style.windowForSignup}>
              <div className={style.upProfile}>
                <img className={style.upImg} src={uploadImg || Default} alt="" />
                <button className={style.upBtn} onClick={() => imageRef.current?.click()}>이미지 선택</button>
                <input ref={imageRef} type="file" accept="image/jpg, image/jpeg, image/png" style={{ display: 'none' }}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setUploadImg(URL.createObjectURL(e.target.files![0]))
                    setSendImg(e.target.files![0])
                  }}
                />
              </div>
              <input type="text" className={style.windowInput} placeholder='dyacode@pmh.codes' value={user.email} onChange={(e: ChangeEvent<HTMLInputElement>) => setUser({ ...user, email: e.target.value })} />
              <input type="password" className={style.windowInput} placeholder='********' value={user.password} onChange={(e: ChangeEvent<HTMLInputElement>) => setUser({ ...user, password: e.target.value })} />
              <input type="text" className={style.windowInput} placeholder='dya-only' value={user.githubId} onChange={(e: ChangeEvent<HTMLInputElement>) => setUser({ ...user, githubId: e.target.value })} />
              <button className={style.windowButton} onClick={submitSignup}>회원가입</button>
            </div>
          </div>
          : null)}

      <nav>
        <div className={style.container}>
          <Link className={style.navTitle} to={'/'}>Star</Link>
          <div className={style.navItems}>
            <Link className={style.navItem} to={'/'}>메인</Link>
            <Link className={style.navItem} to={'/ranking'}>랭킹</Link>
            <div className={style.navItem}>비교</div>
            <div ref={loginRef} className={style.navItem} onClick={windowController}>
              <FontAwesomeIcon icon={faRightToBracket} className={style.icon} />
            </div>
            <div ref={profileRef} className={style.navItem}>
              <img ref={profileImgRef} className={style.profileImg} src={`/api/image/user/${profile.image}`} alt="" />
            </div>
          </div>
        </div>
      </nav>
    </Fragment>
  )
}