import { signOut } from "@/web/lib/auth-client";
import { Link, useLocation } from "@tanstack/react-router";
import { useAuth } from "@/web/hooks/useAuth";

export default function AppNavbar() {
  const location = useLocation();
  const { isLoggedIn, isAdmin, user, isPending } = useAuth();

  return (
    <nav className="container">
      <ul>
        <li><strong>Tasks App</strong></li>
      </ul>
      <ul>
        {location.pathname !== "/" && (
          <li>
            <Link to="/">Home</Link>
          </li>
        )}
        {!isLoggedIn && (
          <>
            <li>
              <Link to="/profile" className="contrast">Profile</Link>
            </li>
            {isAdmin && (
              <li>
                <Link to="/admin-dashboard" className="contrast">Admin Dashboard</Link>
              </li>
            )}
            <li className="user-avatar">
              {user?.image && (
                <img src={user.image} alt={user.name || "User"} />
              )}
                <p>{user!.name}</p>
                </li>
            <li>
              <button
                type="button"
                className="outline contrast"
                onClick={() => signOut()}
              >
                Sign Out
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
