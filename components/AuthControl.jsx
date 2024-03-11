import useAuthUser from '../store/useAuthUser';

const AuthControl = () => {
  const { user, login, logout } = useAuthUser();

  const handleLogin = () => {
    const userData = { id: 1, username: 'exampleUser' };
    login(userData);
    console.log("log in")
  };

  const handleLogout = () => {
    logout();
    console.log("log out")
  };

  return (
    <div>
      {user ? (
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