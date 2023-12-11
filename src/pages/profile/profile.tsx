import { ChangeEvent, FormEvent, Fragment, useEffect, useState } from 'react'
import style from './profile.module.css'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import Nav from '../../components/nav/nav'

export default function Profile() {
  const { githubid } = useParams()
  const navigate = useNavigate()

  const [user, setUser] = useState({
    id: 0,
    email: '',
    githubId: '',
    image: ''
  })
  const [update, setUpdate] = useState({
    email: '',
    password: '',
    githubId: ''
  })
  const [isMyProfile, setIsMyProfile] = useState<boolean>(false)
  const [isUpdateWindow, setIsUpdateWindow] = useState<boolean>(false)

  useEffect(() => {
    verify()
  }, [])

  const verify = () => {
    axios.get('/api/user/@me', {
      headers: {
        'Authorization': localStorage.getItem('TOKEN')
      }
    }).then(resp => {
      getUserInfo(resp.data.id)
    }).catch(_ => {
      getUserInfo(0)
      if (!githubid)
        navigate('/404')
    })
  }

  const getUserInfo = (userId: number) => {
    axios.get(`/api/user/by-github/${githubid}`, {
      headers: {
        'Authorization': localStorage.getItem('TOKEN')
      }
    }).then(resp => {
      setUser({
        id: resp.data.id,
        email: resp.data.email,
        githubId: resp.data.githubId,
        image: resp.data.image
      })

      if (resp.data.id === userId) {
        setIsMyProfile(true)
      }
    })
  }

  const logout = () => {
    localStorage.removeItem('TOKEN')
    window.location.href = '/'
  }

  const vs = () => {
    navigate(`/vs/${user.githubId}`)
  }

  const updateSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData()
    if (update.email !== '') formData.append('email', update.email)
    if (update.password !== '') formData.append('password', update.password)
    if (update.githubId !== '') formData.append('githubId', update.githubId)

    axios.put(`/api/user/${user.id}`, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(resp => {
      console.log(resp.data)
      window.location.href = `/profile/${update.githubId == '' ? user.githubId : update.githubId }`
    })
  }

  return (
    <Fragment>
      <Nav type='contain' />

      {isUpdateWindow && isMyProfile ?
        <div className={style.updateWindowContainer}>
          <form onSubmit={updateSubmit}>
            <div className={style.updateWindow}>
              <div className={style.inputContainer}>
                <div className={style.inputTag}>새로운 이메일 (선택)</div>
                <input type="email" className={style.input} placeholder='dyacode@proton.me' value={update.email} onChange={(e: ChangeEvent<HTMLInputElement>) => setUpdate({ ...update, email: e.target.value })} />
              </div>

              <div className={style.inputContainer}>
                <div className={style.inputTag}>새로운 비밀번호 (선택)</div>
                <input type="password" className={style.input} placeholder='* * * * * * * *' value={update.password} onChange={(e: ChangeEvent<HTMLInputElement>) => setUpdate({ ...update, password: e.target.value })} />
              </div>

              <div className={style.inputContainer}>
                <div className={style.inputTag}>새로운 깃허브 아이디 (선택)</div>
                <input type="text" className={style.input} placeholder='dya-only' value={update.githubId} onChange={(e: ChangeEvent<HTMLInputElement>) => setUpdate({ ...update, githubId: e.target.value })} />
              </div>

              <button className={style.updateBtn} type='submit'>정보 수정</button>
            </div>
          </form>
        </div>
        : null}

      <div className={style.profileContainer}>
        <div className={style.container}>
          <div className={style.profile}>
            <img className={style.profileImg} src={`/api/image/user/${user.image}`} alt="" onClick={() => setIsUpdateWindow(true)} />
            <div className={style.profileContentContainer}>
              <div className={style.profileEmail}>{user.email}</div>
              <a className={style.profileGithubId} href={`https://github.com/${user.githubId}`} target='_blank'>{user.githubId}</a>
              {isMyProfile ? <button className={style.logout} onClick={logout}>로그아웃</button> : null}
              {!isMyProfile ? <button className={style.vs} onClick={vs}>VS</button> : null}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  )
}