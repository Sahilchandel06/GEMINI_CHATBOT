import { Link, Outlet } from "react-router-dom";
import "./rootLayout.css";
import { ClerkProvider } from "@clerk/clerk-react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Import your publishable key
const PUBLISHABLE_KEY =
  "pk_test_YWNjZXB0ZWQtZWFnbGUtNTUuY2xlcmsuYWNjb3VudHMuZGV2JA";

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

const queryClientInstance = new QueryClient(); // Renamed to avoid conflict

const RootLayout = () => {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <QueryClientProvider client={queryClientInstance}>
        <div className="rootLayout">
          <header>
            <Link to="/">Kalakriti</Link>
            <div className="features">
              <Link className="chatbot" to="/dashboard">
                Chatbot
              </Link>

              <div className="user">
                <SignedIn>
                  <UserButton />
                </SignedIn>
                <SignedOut>
                  <SignInButton />
                </SignedOut>
              </div>
            </div>
          </header>

          <main>
            <Outlet />
          </main>
        </div>
      </QueryClientProvider>
    </ClerkProvider>
  );
};
export default RootLayout;
