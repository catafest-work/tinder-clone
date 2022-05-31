import TinderCard from "react-tinder-card"
import {useEffect, useState} from 'react'
import ChatContainer from "../components/ChatContainer"
import axios from "axios"
import { useCookies } from "react-cookie"

const Dashboard = () => {
  const [user, setUser] = useState(null)
  const [genderedUsers, setGenderedUsers] = useState(null)
  const [cookies, setCookie, removeCookie] = useCookies(['user']);

  const userId = cookies.UserId

  const getUser = async () => { 
    try {
      const response = await axios.get('http://localhost:8080/user', {
        params: { userId }
      })
      setUser(response.data)
    } catch (err) {
      console.error(err)
    }
  }

  const getGenderedUsers = async () => { 
    try {
      const response = await axios.get('http://localhost:8080/gendered-users', {
        params: { gender: user?.gender_interest }
      })
      setGenderedUsers(response.data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    getUser()
    getGenderedUsers()
  }, [])
  
  console.log('user is : ', user)
  console.log('gendered users is : ', getGenderedUsers)

  const characters = [
    {
      name: "Richard Hendricks",
      url: 'https://i.imgur.com/NAGTvvz.png'
    },
    {
      name: 'Erlich Bachman',
      url: 'https://i.imgur.com/NAGTvvz.png'
    },
    {
      name: 'Monica Hall',
      url: 'https://i.imgur.com/NAGTvvz.png'
    },
    {
      name: 'Jared Dunn',
      url: 'https://i.imgur.com/NAGTvvz.png'
    },
    {
      name: 'Dinesh Chugtai',
      url:'https://i.imgur.com/NAGTvvz.png'
    }
  ]
  const [lastDirection, setLastDirection] = useState()

  const swiped = (direction, nameToDelete) => {
    console.log('removing: ' + nameToDelete)
    setLastDirection(direction)
  }

  const outOfFrame = (name) => {
    console.log(name + ' left the screen')
  }

  return (
    <>
    {user && 
    <div className="dashboard">
      <ChatContainer user={user}/>
      <div className="swipe-container">
        <div className="card-container">
          {characters.map((character) => // errori si modificari ...
            <TinderCard className='swipe' key={character.name} onSwipe={(dir) => swiped(dir, character.name)} onCardLeftScreen ={() => outOfFrame(character.name)}>
            <div style={{ backgroundImage: 'url(' +character.url + ')' }} className='card'>
            <h3>{character.name}</h3>
            </div>
            </TinderCard>
            )}
          <div className="swipe-info"> {lastDirection ? <p>You swipe {lastDirection}</p> : <p/> }</div>  
        </div>
      </div>
    </div>
    }
    </>
  )
}
export default Dashboard