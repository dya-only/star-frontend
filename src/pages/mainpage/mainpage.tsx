import { Fragment } from 'react'
import style from './mainpage.module.css'
import Footer from '../../components/footer/footer'

import BG from '../../assets/imgs/card.webp'
import Ranking from '../../assets/imgs/ranking.svg'
import Compare from '../../assets/imgs/compare.svg'
import Nav from '../../components/nav/nav'

export default function Mainpage() {
  return (
    <Fragment>
      <Nav />

      <div className={style.bgContainer}>
        <img className={style.bg} src={BG} alt="" />
        <div className={style.title}>GBSW<br/>깃허브 스타 랭킹 서비스</div>
        <div></div>
      </div>

      <section>
        <div className={style.starter}>
          <div className={style.container}>
            <div className={style.starterText}>지금바로 자신의 깃허브 스타 랭킹을 확인해보세요</div>
            <button className={style.btn}>바로가기</button>
          </div>
        </div>

        <div className={style.object}>
          <div className={style.container}>
            <img className={style.objectImg} src={Ranking} alt="" />
            <div className={style.objectText}>깃허브 스타 랭킹을 확인해보세요.</div>
          </div>
        </div>

        <div className={style.object}>
          <div className={style.container}>
            <div className={style.objectText}>여러 깃허브 정보를 비교할 수 있어요.</div>
            <img className={style.objectImg} src={Compare} alt="" />
          </div>
        </div>
      </section>

      <Footer />
    </Fragment>
  )
}
