import { Fragment, useEffect, useState } from 'react'
import style from './profile.module.css'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import Nav from '../../components/nav/nav'

export default function Profile() {
  const { githubid } = useParams()
  const navigate = useNavigate()
  
  const [user, setUser] = useState({
    email: '',
    githubId: '',
    image: ''
  })

  useEffect(() => {
    verify()
  }, [])

  const verify = () => {
    axios.get(`/api/user/by-github/${githubid}`, {
      headers: {
        'Authorization': sessionStorage.getItem('TOKEN')
      }
    }).then(resp => {
      setUser({
        email: resp.data.email,
        githubId: resp.data.githubId,
        image: resp.data.image
      })
    }).catch(_ => {
      if (!githubid)
        navigate('/404')
    })
  }

  return (
    <Fragment>
      <Nav type='contain' />

      <div className={style.profileContainer}>
        <div className={style.container}>
          <div className={style.profile}>
            <img className={style.profileImg} src={`/api/image/user/${user.image}`} alt="" />
            <div>
              <div className={style.profileEmail}>{ user.email }</div>
              <a className={style.profileGithubId} href={`https://github.com/${user.githubId}`} target='_blank'>{ user.githubId }</a>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  )
}