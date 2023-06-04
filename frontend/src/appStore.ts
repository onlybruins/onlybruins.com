import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware"

interface Store {
  username?: string;
  signIn: (username: string) => void;
}

const useAppStore = create<Store>()(persist((set) => ({
  username: undefined,
  signIn: (username: string) => set((state) => ({ ...state, username })),
}), {
  name: 'onlybruinsappstore',
  storage: createJSONStorage(() => sessionStorage)
}))

export default useAppStore;
