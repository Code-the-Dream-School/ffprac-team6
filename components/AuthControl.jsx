'use client'

import { useSession } from "next-auth/react"
import { useRouter } from 'next/router';
import useAuthUser from '../store/useAuthUser';

const AuthControl = () => {
  const { user, login, logout } = useAuthUser();
  const { data: session } = useSession();
  console.log({ data: session } )
  const router = useRouter();

  const handleLogin = () => {
    const userData = { id: 1, username: 'exampleUser' };
    login(userData);
    router.push('/market'); 
    console.log("log in")
  };

  const handleLogout = () => {
    logout();
    router.push('/signin'); 
    console.log("log out")
  };

  return (
    <div>
      {user && session ? (
        <>
          <p>Welcome, {user.name}!</p>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
};

export default AuthControl;