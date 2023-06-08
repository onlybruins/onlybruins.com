import { Text, Box, Center, HStack, Spinner, useColorModeValue, useToken } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { Coins } from "phosphor-react";
import useAppStore from "./appStore";

export const Balance = () => {
  const boxColor = useColorModeValue('yellow.400', 'yellow.500');
  const iconColor = useColorModeValue('yellow.600', 'yellow.700');
  const [iconRgb] = useToken('colors', [iconColor]);
  const username = useAppStore((state) => state.username!);
  const { data, isLoading } = useQuery({
    queryKey: ['balance'],
    queryFn: async () => {
      console.log('fetching balance...')
      const resp = await fetch(`/api/users/${username}/balance`)
      if (!resp.ok) {
        throw new Error('error occurred while getting balance')
      }
      const data = await resp.json()
      return data
    }
  })

  if (isLoading) return <Spinner />

  return (
    <Box bg={boxColor} borderRadius='md' px={4}>
      <Center h={10}>
        <HStack spacing={3}>
          <Coins color={iconRgb} size="1.2rem" weight="regular" />
          <Text color={iconColor}>{data.balance?.toLocaleString()}</Text>
        </HStack>
      </Center>
    </Box>
  )
}

