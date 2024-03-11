import  { create } from 'zustand';

const useAuthUser = create((set) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        set({ user: data.user, token: data.token, isLoading: false });
        //TODO: store the token in cookies
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
  logout: () => {
    set({ user: null, token: null });
    //TODO: clear the token from cookies 
  },
  register: async (newUserData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUserData),
      });
      const data = await response.json();
      if (response.ok) {
        set({ user: data.user, token: data.token, isLoading: false });
        //TODO: store the token and possibly user data for persistence
      } else {
        throw new Error(data.message || 'Registration failed');
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
}));

export default useAuthUser;
