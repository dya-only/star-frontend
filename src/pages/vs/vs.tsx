import axios from 'axios'
import { Fragment, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Vs() {
  const navigate = useNavigate()

  useEffect(() => {
    verify()
  }, [])

  const verify = () => {
    axios.get('/api/user/@me', {
      headers: {
        'Authorization': localStorage.getItem('TOKEN')
      }
    }).then(resp => {
      console.log(resp.data)
    }).catch(_ => {
      navigate('/404')
    })
  }

  return (
    <Fragment>
      
    </Fragment>
  )
}