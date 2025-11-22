import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth";
import ThemeToggle from "./ThemeToggle";

export default function NavBar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  return (
    <header className="border-b border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-gray-950/60 backdrop-blur">
      <div className="container max-w-[1200px] mx-auto flex h-14 items-center justify-between px-4">
        <Link to="/dashboard" className="text-lg font-semibold tracking-tight">
          <span className="text-gray-900 dark:text-white">MERN</span>{" "}
          <span className="text-gray-500">Foundation</span>
        </Link>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {user && (
            <Link to="/profile" className="btn btn-outline">
              Profile
            </Link>
          )}
          {user ? (
            <>
              <span className="hidden sm:inline text-sm text-gray-600 dark:text-gray-300">
                {user.name ?? user.email}
              </span>
              <button
                className="btn btn-outline"
                onClick={async () => {
                  await logout();
                  nav("/login");
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
