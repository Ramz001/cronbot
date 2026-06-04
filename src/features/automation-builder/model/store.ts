import { create } from 'zustand'
import { Provider } from '@prisma/generated/enums'

export interface BuilderState {
  action: Provider | null
  guildId: string | null
  channelId: string | null
  message: string
  /** Raw axios/react-query error object, or null when clean */
  queryError: unknown
  setAction: (action: Provider | null) => void
  setGuildId: (guildId: string | null) => void
  setChannelId: (channelId: string | null) => void
  setMessage: (message: string) => void
  setQueryError: (error: unknown) => void
  clearQueryError: () => void
}

export const useBuilderStore = create<BuilderState>((set) => ({
  action: null,
  guildId: null,
  channelId: null,
  message: '',
  queryError: null,
  setAction: (action) => set({ action }),
  setGuildId: (guildId) => set({ guildId, channelId: null }),
  setChannelId: (channelId) => set({ channelId }),
  setMessage: (message) => set({ message }),
  setQueryError: (queryError) => set({ queryError }),
  clearQueryError: () => set({ queryError: null }),
}))
