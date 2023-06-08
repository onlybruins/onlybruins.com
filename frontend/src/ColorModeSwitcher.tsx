import * as React from "react"
import {
  useColorMode,
  useColorModeValue,
  IconButton,
  IconButtonProps,
} from "@chakra-ui/react"
import { Moon, Sun } from "phosphor-react"

type ColorModeSwitcherProps = Omit<IconButtonProps, "aria-label">

export const ColorModeSwitcher: React.FC<ColorModeSwitcherProps> = (props) => {
  const { toggleColorMode } = useColorMode()
  const text = useColorModeValue("dark", "light")
  const color = useColorModeValue("blue", "yellow")
  const SwitchIcon = useColorModeValue(Moon, Sun)

  return (
    <IconButton
      size="md"
      fontSize="lg"
      variant="outline"
      colorScheme={color}
      marginLeft="2"
      onClick={toggleColorMode}
      icon={<SwitchIcon weight="duotone" />}
      aria-label={`Switch to ${text} mode`}
      {...props}
    />
  )
}
