import { useEffect } from 'react'
import style from './nav.module.css'

export default function Nav() {
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

  return (
    <nav>
      <div className={style.container}>
        <a className={style.navTitle} href="/">Star</a>
        <div className={style.navItems}>
          <div className={style.navItem}>메인</div>
          <div className={style.navItem}>랭킹</div>
          <div className={style.navItem}>비교</div>
        </div>
      </div>
    </nav>
  )
}