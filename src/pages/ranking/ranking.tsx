import { useNavigate } from "react-router-dom"
import axios from "axios"
import { Fragment } from "react"

export default function Ranking () {
  const navigate = useNavigate()

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
      <h1>Ranking Page</h1>
      <button onClick={verify}>asdf</button>
    </Fragment>
  )
}