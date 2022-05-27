import Nav from "../components/Nav";
import { useState } from "react";
import AuthModal from "../components/AuthModal";

const Home = () => {
  const [showModal, setShowModal] = useState(false); // will use setShowModal if showModal is changed
  const [isSignUp, setIsSignUp] = useState(true); // use this for login and register account logic
  const authToken = false; // if is false will se button with "Create Account" 
  const handleClick = () => {
    console.log('clicked')
    setShowModal(true)
    setIsSignUp(true)
  }
  return (
    <div className="overlay">
    <Nav 
    minimal={false} 
    setShowModal={setShowModal}
    showModal={showModal}
    setIsSignUp={setIsSignUp} />
    <div className="home">
      <h1 className="primary-title">Swipe Right</h1>
      <button className="primary-button" onClick={handleClick} >
        {authToken ? 'Signout' : 'Create Account' } 
      </button>
      {showModal && (
        <AuthModal setShowModal={setShowModal} isSignUp={isSignUp}/>
      )}
    </div>
    </div>
  )
}
export default Home