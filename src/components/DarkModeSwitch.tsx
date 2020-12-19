import { useColorMode, Switch } from '@chakra-ui/react'

export const DarkModeSwitch = () => {
  const { colorMode, toggleColorMode } = useColorMode()
  const isDark = colorMode === 'dark'
  return (
    <Switch
      ml={4}
      color="green"
      isChecked={isDark}
      onChange={toggleColorMode}
    />
  )
}