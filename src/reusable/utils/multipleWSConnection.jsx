const connectWebSocketChat = (url, userID, onMessageReceived) => {
  const socket = new WebSocket(url);

  socket.onopen = function () {
    if (socket.readyState === WebSocket.OPEN) {
      if (userID) {
        socket.send(
          JSON.stringify({
            user: userID,
            default: true,
          })
        );
      } else {
        socket.send(
          JSON.stringify({
            user: false,
            default: true,
          })
        );
      }
    }
  };

  socket.onmessage = function (event) {
    const eventObject = JSON.parse(event.data);
    
    if (eventObject.unique_id) {
      onMessageReceived(eventObject);
    }
  };

  socket.onclose = function (event) {
    
    // Implement reconnect logic if needed
  };

  socket.onerror = function (event) {
    console.error('WebSocket error:', event.message);
  };

  return socket;
};

export default connectWebSocketChat;
