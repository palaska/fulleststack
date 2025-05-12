import { useAuth } from '../hooks/useAuth';
import { signOut } from '../lib/auth-client';

export function UserProfile() {
  const { isLoggedIn, isAdmin, user, isPending } = useAuth();

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (!isLoggedIn) {
    return <div>Please sign in to view your profile</div>;
  }

  return (
    <div>
      <h2>User Profile</h2>
      <div>
        <p>Name: {user?.name}</p>
        <p>Email: {user?.email}</p>
        {isAdmin && <p>Admin Status: Administrator</p>}
        <button onClick={() => signOut()}>Sign out</button>
      </div>
    </div>
  );
}
