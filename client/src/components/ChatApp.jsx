import { useEffect, useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const COMMANDS = `
Welcome to The DuckHunt!

Commands:
!bang - Shoot a duck
!stats - Show your stats
!top - Show leaderboard
!reload - Reload your weapon
!help - Show this message again
`;

export default function DuckHuntChat() {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [users, setUsers] = useState([]);
  const chatEndRef = useRef(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("duckhunt_username");
    if (!storedUser) {
      const name = prompt("Welcome to The DuckHunt!\nPlease enter your username:");
      if (name) {
        setUsername(name);
        localStorage.setItem("duckhunt_username", name);
      }
    } else {
      setUsername(storedUser);
    }
  }, []);

  useEffect(() => {
    if (username) {
      const ws = new WebSocket("wss://duckhunt-webserver.onrender.com");
      ws.onmessage = (event) => {
        const { from, message } = JSON.parse(event.data);
        addChat(`${from}: ${message}`);
        setUsers((prev) => [...new Set([...prev, from])]);
      };
      setSocket(ws);
    }
  }, [username]);

  const addChat = (text) => {
    setChat((prev) => [...prev, text]);
  };

  const handleCommand = () => {
    if (!message.trim() || !socket) return;
    socket.send(JSON.stringify({ username, message }));
    setMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleCommand();
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen p-2 gap-2">
      <Card className="flex-1 overflow-hidden">
        <CardContent className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto whitespace-pre-wrap text-sm p-2 font-mono">
            {chat.map((line, idx) => (
              <div key={idx}>{line}</div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Input
              placeholder="Type a command..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Button onClick={handleCommand}>Send</Button>
          </div>
        </CardContent>
      </Card>
      <Card className="w-full md:w-64">
        <CardContent className="p-2 text-sm">
          <h2 className="font-bold mb-2">Active Users</h2>
          <ul>
            {users.map((user, idx) => (
              <li key={idx}>🦆 {user}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
