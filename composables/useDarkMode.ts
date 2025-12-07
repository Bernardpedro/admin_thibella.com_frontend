export const useDarkMode = () => {
  const isDark = useState<boolean>('darkMode', () => {
    // Initialize from localStorage if available
    if (import.meta.client) {
      const saved = localStorage.getItem('theme')
      return saved === 'dark'
    }
    return false
  })

  const initDarkMode = (): void => {
    if (import.meta.client) {
      const savedTheme = localStorage.getItem('theme')
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      
      if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        isDark.value = true
        document.documentElement.classList.add('dark')
      } else {
        isDark.value = false
        document.documentElement.classList.remove('dark')
      }
    }
  }

  const toggleDarkMode = (): void => {
    isDark.value = !isDark.value
    if (import.meta.client) {
      if (isDark.value) {
        document.documentElement.classList.add('dark')
        localStorage.setItem('theme', 'dark')
      } else {
        document.documentElement.classList.remove('dark')
        localStorage.setItem('theme', 'light')
      }
    }
  }

  return {
    isDark,
    initDarkMode,
    toggleDarkMode
  }
}