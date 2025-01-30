import {create} from 'zustand'
import { persist } from 'zustand/middleware'

const lengthstore = create(
  persist(
    (set) => ({
      length: 0,
      add: (newlength) => set((state) => ({ 
        length: newlength
      })),
      clearlength: () => set({ length: 0 }),
    }),
    {
      name: 'length-storage', // unique name for localStorage
    }
  )
);


export default lengthstore;