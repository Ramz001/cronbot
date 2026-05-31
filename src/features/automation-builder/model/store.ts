import { create } from 'zustand'
import { Provider } from '@prisma/generated/enums'
export interface BuilderState {
  action: Provider | null
  guildId: string | null
  channelId: string | null
  message: string
  setAction: (action: Provider | null) => void
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
