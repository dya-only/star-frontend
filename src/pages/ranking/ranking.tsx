import { Fragment, useEffect, useRef, useState } from "react"
import axios from "axios"
import style from './ranking.module.css'
import Nav from "../../components/nav/nav"

export default function Ranking() {
  const [ranking, setRanking] = useState<string[]>([])
  const [plusStatus, setPlusStatus] = useState<boolean>(true)
  let loginedId: string
  let progressWidth = 0

  const progressContainerRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const addBtn = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    verify()
    getRanking()
  }, [])

  const verify = () => {
    axios.get('/api/user/@me', {
      headers: {
        'Authorization': localStorage.getItem('TOKEN')
      }
    }).then(resp => {
      if (resp.data.isRanking === 'true') setPlusStatus(false)
      loginedId = resp.data.githubId
    }).catch(_ => {
      // navigate('/404')
      addBtn.current!.style.setProperty('display', 'none')
    })
  }

  const getRanking = () => {
    progressContainerRef.current!.style.setProperty('transform', 'translateY(0)')

    axios.get('/api/user')
      .then(async (resp) => {
        const ranking = resp.data.filter((x: { isRanking: string }) => x.isRanking === 'true')

        let least
        for (let i = 0; i < ranking.length - 1; i++) {
          least = i;

          for (let j = i + 1; j < ranking.length; j++) {
            let a = await getStars(ranking[j].githubId)
            let b = await getStars(ranking[least].githubId)

            if (a < b)
              least = j
          }
          progressWidth += 50 / (ranking.length - 1)
          progressRef.current!.style.setProperty('width', `${progressWidth.toString()}%`)

          if (i != least) {
            let tmp = ranking[i]
            ranking[i] = ranking[least]
            ranking[least] = tmp
          }
        }
        
        for (let i = ranking.length - 1; i >= 0; i--) {
          setRanking(prev => [...prev, ranking[i]])
          getGithubUser(ranking[i].githubId, ranking.length)
        }
      })
  }

  const getGithubUser = (username: string, length: number) => {
    axios.get(`/api/user/stars/${username}`)
      .then(resp => {
        const stars = resp.data + 10

        const profile = document.getElementById(username + 'i') as HTMLElement
        const user = document.getElementById(username) as HTMLElement
        user.style.width = `${stars * 5}px`

        if (username === loginedId) {
          user.style.background = 'linear-gradient(90deg, rgba(0,255,136,1) 0%, rgba(0,245,255,1) 100%)'
        }

        const userN = document.getElementById(username + 'n') as HTMLElement
        userN.innerText = resp.data

        profile.addEventListener('mouseover', () => {
          userN.innerText = username
        })
        profile.addEventListener('mouseout', () => {
          userN.innerText = resp.data
        })

        progressWidth += 50 / length
        progressRef.current!.style.setProperty('width', `${progressWidth.toString()}%`)

        if (progressWidth >= 90) {
          setTimeout(() => {
            progressContainerRef.current!.style.setProperty('transform', 'translateY(-100px)')
          }, 1000)
        }

        return stars
      })
  }

  const getStars = async (username: string) => {
    const stars = await axios.get(`/api/user/stars/${username}`)
    return stars.data
  }

  const addAccount = async () => {
    const user = await axios.get('/api/user/@me', {
      headers: { 'Authorization': localStorage.getItem('TOKEN') }
    })

    const formData = new FormData()
    formData.append('isRanking', 'true')

    axios.put(`/api/user/${user.data.id}`, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(_ => {
      window.location.href = '/ranking'
    })
  }

  return (
    <Fragment>
      <Nav type={'contain'} />

      <div ref={progressContainerRef} className={style.msgContainer}>
        <div className={style.msg}>
          <div className={style.checkContainer}>
            <svg className={style.checkIcon} xmlns="http://www.w3.org/2000/svg" height="16" width="15.5" viewBox="0 0 496 512"><path opacity="1" fill="#ffffff" d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z" /></svg>
            <div className={style.checkBg} />
          </div>

          <div className={style.msgProgress}>
            <div ref={progressRef} className={style.msgProgressLine}></div>
          </div>
        </div>
      </div>

      <div className={style.rankingContainer}>
        <div className={style.container}>
          <div className={style.menu}>
            <div className={style.menuItem}>Github Stars Ranking</div>
            {plusStatus ? <button ref={addBtn} className={style.menuBtn} onClick={addAccount}>내 정보 등록</button> : <button ref={addBtn} className={style.menuBtnDisable}>내 정보 등록</button>}
          </div>

          {ranking?.map((el: any, idx: number) => {
            return <div key={idx} className={style.graphContainer}>
              <a href={`/profile/${el.githubId}`} target='_blank' className={style.graphImg}>
                <img id={`${el.githubId}i`} className={style.graphImg} src={`https://avatars.githubusercontent.com/${el.githubId}`} />
              </a>
              <div id={el.githubId} className={style.graph} />
              <div id={`${el.githubId}n`} className={style.graphN} />
            </div>
          })}
        </div>
      </div>
    </Fragment>
  )
}