import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Homepage from "./routes/homepage/homepage.jsx";
import Dashboard from "./routes/dashboard/dashboard.jsx";
import Chatpage from "./routes/chatpage/chatpage.jsx";
import RootLayout from "./layouts/rootLayout/rootLayout.jsx";
import DashboardLayout from "./layouts/dashboardlayout/dashboardlayout.jsx";
import { SignIn } from "@clerk/clerk-react";
import Signuppage from "./routes/signuppage/signuppage.jsx";
import Signinpage from "./routes/signinpage/signinpage.jsx";

// // Import your publishable key
// const PUBLISHABLE_KEY =

// if (!PUBLISHABLE_KEY) {
//   throw new Error("Missing Publishable Key");
// }

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <Homepage />,
      },
      {
        path: "/sign-in/*",
        element: <Signinpage />,
      },
      {
        path: "/sign-up/*",
        element: <Signuppage />,
      },
      {
        element: <DashboardLayout />,
        children: [
          {
            path: "/dashboard",
            element: <Dashboard />,
          },
          {
            path: "/dashboard/chats/:id",
            element: <Chatpage />,
          },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
