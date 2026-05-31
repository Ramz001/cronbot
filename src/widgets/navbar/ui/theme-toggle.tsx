'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { RiMoonClearFill, RiSunFill } from '@remixicon/react'
import { Button } from '@shared/ui/button'

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="size-9"
        disabled
        aria-label="Toggle theme"
      />
    )
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="size-9"
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      aria-label="Toggle theme"
    >
      {resolvedTheme === 'dark' ? (
        <RiSunFill className="size-4 transition-transform duration-200" />
      ) : (
        <RiMoonClearFill className="size-4 transition-transform duration-200" />
      )}
    </Button>
  )
}
