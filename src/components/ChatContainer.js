const ChatContainer = () => {
  return
  ( 
    <div className="chat-container">
      <ChatHeader/>
      <div>
        <button className="option">Matches</button>
        <button className="option">Chats</button>
      </div>
      <MatchesDiplay/>
      <ChatDisplay/>
    </div>
  )
}

export default ChatContainer