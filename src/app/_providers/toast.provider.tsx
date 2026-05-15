import { Toaster } from '@shared/ui/sonner'

export default function ToastProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
      <Toaster position="top-center" richColors />
    </>
  )
}
