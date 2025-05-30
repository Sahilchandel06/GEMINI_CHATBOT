import { Outlet, useNavigate } from "react-router-dom";
import "./dashboardlayout.css";
import { useAuth } from "@clerk/clerk-react";
import { useEffect } from "react";
import { useSignIn } from "@clerk/clerk-react";
import ChatList from "../../components/chatlist";

const DashboardLayout = () => {
  const { userId, isLoaded } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (isLoaded && !userId) {
      navigate("/sign-in");
    }
  }, [isLoaded, userId, navigate]);

  if (!isLoaded) return "Loading...";

  return (
    <div className="dashboardLayout">
      <div className="menu">
        <ChatList />
      </div>
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};
export default DashboardLayout;
