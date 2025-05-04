import { signOut, useSession } from "@/web/lib/auth-client";
import { Link, useLocation } from "@tanstack/react-router";

export default function AppNavbar() {
  const location = useLocation();
  const { data: session, isPending } = useSession();

  // Check if user is an admin
  const isAdmin = session?.user && "role" in session.user && session.user.role === "admin";

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
        {!isPending && session?.user && (
          <>
            {/* Show Admin link only to admin users */}
            {isAdmin && (
              <li>
                <Link to="/admin" className="contrast">Admin</Link>
              </li>
            )}
            <li className="user-avatar">
              <img src={session.user.image || ""} alt={session.user.name || "User"} />
              <p>{session.user.name}</p>
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
