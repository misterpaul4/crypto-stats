import { create } from 'zustand';

interface CommandPaletteState {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const useCommandPalette = create<CommandPaletteState>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
}));
