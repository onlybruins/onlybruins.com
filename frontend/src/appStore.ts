import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware"

type AuthUI = 'login' | 'register' | 'profile';

interface Store {
  username?: string;
  signIn: (username: string) => void;
  signOut: () => void;
  profilepage: (username: string) => void;
  authUI: AuthUI;
  setAuthUI: (t: AuthUI) => void;
}

const useAppStore = create<Store>()(persist((set) => ({
  username: undefined,
  signIn: (username: string) => set((state) => ({ ...state, username })),
  signOut: () => set((state) => ({ ...state, username: undefined})),  
  profilepage: (username: string) => set((state) => ({ ...state, username})),
  authUI: 'register',
  setAuthUI: (t) => set((state) => ({ ...state, authUI: t})),
}), {
  name: 'onlybruinsappstore',
  storage: createJSONStorage(() => sessionStorage)
}))

export default useAppStore;
