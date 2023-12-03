import { useNavigate } from "react-router-dom"
import axios from "axios"
import { Fragment, useEffect } from "react"
import Nav2 from "../../components/nav2/nav2"
import style from './ranking.module.css'

export default function Ranking () {
  const navigate = useNavigate()

  useEffect(() => {
    verify()
  })

  const verify = () => {
    axios.get('/api/user/@me', {
      headers: {
        'Authorization': sessionStorage.getItem('TOKEN')
      }
    }).then(resp => {
      console.log(resp.data)
    }).catch(_ => {
      navigate('/404')
    })
  }

  return (
    <Fragment>
      <Nav2 />
      
      <div className={style.rankingContainer}>
        <div className={style.container}>
          <div className={style.menu}>
            <div className={style.menuItem}>Github</div>
            <button className={style.menuBtn}>내 정보 등록</button>
          </div>

          
        </div>
      </div>
    </Fragment>
  )
}