import { Fragment, useEffect, useState } from 'react'
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
  const [isMyProfile, setIsMyProfile] = useState<boolean>(false)

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

  return (
    <Fragment>
      <Nav type='contain' />

      <div className={style.profileContainer}>
        <div className={style.container}>
          <div className={style.profile}>
            <img className={style.profileImg} src={`/api/image/user/${user.image}`} alt="" />
            <div className={style.profileContentContainer}>
              <div className={style.profileEmail}>{ user.email }</div>
              <a className={style.profileGithubId} href={`https://github.com/${user.githubId}`} target='_blank'>{ user.githubId }</a>
              { isMyProfile ? <button className={style.logout} onClick={logout}>로그아웃</button> : null }
              { !isMyProfile ? <button className={style.vs} onClick={vs}>VS</button> : null }
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  )
}