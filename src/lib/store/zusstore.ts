import {create} from 'zustand';
import { persist } from 'zustand/middleware';

const useStored = create(
  persist(
    (set) => ({
      items: [],
      addItems: (newItems) => set((state) => ({ items: [...state.items, ...newItems] })),
      removeItem: (index) => set((state) => ({
        items: state.items.filter((_, i) => i !== index),
      })),
      clearItems: () => set(() => ({ items: [] })),
    }),
    {
      name: 'zustand-store', // Key in storage
      skipHydration: true
    }
  )
);

export default useStored;
