import { create } from 'zustand'

export interface BuilderState {
  action: string | null
  guildId: string | null
  channelId: string | null
  message: string
  setAction: (action: string | null) => void
  setGuildId: (guildId: string | null) => void
  setChannelId: (channelId: string | null) => void
  setMessage: (message: string) => void
}

export const useBuilderStore = create<BuilderState>((set) => ({
  action: null,
  guildId: null,
  channelId: null,
  message: '',
  setAction: (action) => set({ action }),
  setGuildId: (guildId) => set({ guildId, channelId: null }),
  setChannelId: (channelId) => set({ channelId }),
  setMessage: (message) => set({ message }),
}))
