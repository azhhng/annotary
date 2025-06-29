import { useState, useEffect } from 'react'

export function useTheme() {
  const [bgColors, setBgColors] = useState({
    start: '#667eea',
    end: '#764ba2'
  })

  useEffect(() => {
    document.body.style.background = `linear-gradient(135deg, ${bgColors.start} 0%, ${bgColors.end} 100%)`
  }, [bgColors])

  return {
    bgColors,
    setBgColors
  }
}
