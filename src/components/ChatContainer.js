/* eslint-disable no-unreachable */
import ChatHeader from "./ChatHeader"
import MatchesDiplay from "./MatchesDisplay"
import ChatDisplay from "./ChatDisplay"

const ChatContainer = () => {
 return(
    <div className="chat-container">
      
      <ChatHeader/>
      <div>
        <button className="option">Matches</button>
        <button className="option">Chat</button>
      </div>
      <MatchesDiplay/>
      <ChatDisplay/>
    </div>
 )
}

export default ChatContainer