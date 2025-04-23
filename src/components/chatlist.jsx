import { Link } from "react-router-dom";
import "./chatlist.css";
import { useQuery } from "@tanstack/react-query";
const ChatList = () => {
  const { isPending, error, data } = useQuery({
    queryKey: ["userChats"],
    queryFn: () =>
      fetch("http://localhost:3000/api/userchats", {
        credentials: "include",
      }).then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch user chats");
        }
        return res.json();
      }),
  });

  return (
    <div className="chatList">
      <span className="title">DASHBOARD</span>
      <Link to="/dashboard">Create a new Chat</Link>
      <Link to="/">Explore more features</Link>
      <hr />
      <span className="title">RECENT CHATS</span>
      <div className="list">
        {isPending
          ? "Loading..."
          : error
          ? "Something went wrong!"
          : data?.map((chat) => (
              <Link to={`/dashboard/chats/${chat._id}`} key={chat._id}>
                {chat.title}
              </Link>
            ))}
      </div>
      <hr />
    </div>
  );
};
export default ChatList;
