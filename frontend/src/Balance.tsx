import { Text, Box, Center, HStack, Spinner, useColorModeValue, useToken } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { Coins } from "phosphor-react";
import useAppStore from "./appStore";
import { useCountUp } from 'react-countup';
import { useRef } from "react";

export const Balance = () => {
  const countUpRef = useRef(null);
  const { update } = useCountUp({
    ref: countUpRef,
    duration: 3,
    start: 0,
    end: 0,
  });
  const boxColor = useColorModeValue('yellow.400', 'yellow.500');
  const iconColor = useColorModeValue('yellow.600', 'yellow.700');
  const [iconRgb] = useToken('colors', [iconColor]);
  const username = useAppStore((state) => state.username!);
  const { data, isLoading } = useQuery({
    queryKey: ['balance'],
    queryFn: async () => {
      const resp = await fetch(`/api/users/${username}/balance`)
      if (!resp.ok) {
        throw new Error('error occurred while getting balance')
      }
      const data = await resp.json()
      update(data.balance)
      return data
    }
  })

  if (isLoading) return <Spinner />

  return (
    <Box bg={boxColor} borderRadius='md' px={4}>
      <Center h={10}>
        <HStack spacing={3}>
          <Coins color={iconRgb} size="1.2rem" weight="regular" />
          <Text ref={countUpRef} color={iconColor}>{data.balance?.toLocaleString()}</Text>
        </HStack>
      </Center>
    </Box>
  )
}

