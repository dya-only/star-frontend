import { ChangeEvent, Fragment, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBoltLightning, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import style from './vs.module.css'

import Nav from '../../components/nav/nav'
import Default from '../../assets/imgs/default.png'

export default function Vs() {
  const navigate = useNavigate()
  const { githubid } = useParams()

  const [searchValue, setSearchValue] = useState<string>()
  const [me, setMe] = useState({
    id: 0,
    email: '',
    githubId: '',
    image: '',
    stars: 0
  })
  const [u, setU] = useState({
    id: 0,
    email: '',
    githubId: '',
    image: '',
    stars: 0
  })

  useEffect(() => {
    verify()
    getU()
  }, [])

  const verify = () => {
    axios.get('/api/user/@me', {
      headers: {
        'Authorization': localStorage.getItem('TOKEN')
      }
    }).then(resp => {
      axios.get(`/api/user/stars/${resp.data.githubId}`)
        .then(_resp => {
          setMe({ ...resp.data, stars: _resp.data })
        })
    }).catch(_ => {
      navigate('/404')
    })
  }

  const getU = () => {
    axios.get(`/api/user/by-github/${githubid}`)
      .then(resp => {
        axios.get(`/api/user/stars/${githubid}`)
          .then(_resp => {
            setU({ ...resp.data, stars: _resp.data })
          })
      }).catch(_ => {
        setU({
          id: 0,
          email: '',
          githubId: '',
          image: '',
          stars: 0
        })
      })
  }

  const submit = () => {
    navigate(`/vs/${searchValue}`)
  }

  return (
    <Fragment>
      <Nav type={'contain'} />

      <div className={style.main}>
        <div className={style.searchContainer}>
          <div className={style.container}>
            <div className={style.search}>
              <FontAwesomeIcon icon={faMagnifyingGlass} className={style.searchIcon} />
              <form onSubmit={submit}>
                <input type="text" placeholder='Github ID' className={style.searchBar} value={searchValue} onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchValue(e.target.value)} />
              </form>
            </div>

            <div />
          </div>
        </div>

        <div className={style.cardContainer}>
          <div className={style.card}>
            <img src={`/api/image/user/${me.image}` || Default} alt="" className={style.profileImg} onClick={() => navigate(`/profile/${me.githubId}`)} />

            <div className={style.info}>
              <div className={style.infoTitle}>github</div>
              <div className={style.githubId}>{me.githubId}</div>
            </div>

            <div className={style.info}>
              <div className={style.infoTitle}>stars</div>
              <div className={me.stars > u.stars ? style.win : style.lose}>{me.stars}</div>
            </div>
          </div>

          <div className={style.icons}>
            <FontAwesomeIcon icon={faBoltLightning} className={style.icon} />
          </div>

          <div className={style.card}>
            <img src={`/api/image/user/${u.image}` || Default} alt="" className={style.profileImg} onClick={() => navigate(`/profile/${u.githubId}`)} />

            <div className={style.info}>
              <div className={style.infoTitle}>github</div>
              <div className={style.githubId}>{u.githubId}</div>
            </div>

            <div className={style.info}>
              <div className={style.infoTitle}>stars</div>
              <div className={u.stars > me.stars ? style.win : style.lose}>{u.stars}</div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  )
}