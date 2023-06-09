import {
  Box,
  Button,
  useColorModeValue,
  useDisclosure,
  Input,
  InputGroup,
  InputLeftElement,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  IconButton,
  HStack,
  Spinner,
  Text,
  VStack,
  Divider,
} from "@chakra-ui/react";
import { useState } from "react";
import useAppStore from "./appStore";
import { MagnifyingGlass, UserCirclePlus } from "phosphor-react";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

type AccountResult = {
  is_following: string;
  follow_link: string;
  username: string;
}

const SearchResult = ({ username, is_following, follow_link }: AccountResult) => {
  const queryClient = useQueryClient();
  const boxColor = useColorModeValue('gray.50', 'gray.600');

  const { mutate } = useMutation({
    mutationFn: async () => {
      await fetch(follow_link, {
        method: is_following ? 'DELETE' : 'PUT'
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['searchResults'] })
    }
  })

  return (
    <Box bg={boxColor} w="full" px="3" py="2" borderRadius="md">
      <HStack justifyContent="space-between">
        <Text>
          {username}
        </Text>
        <Button
          size="sm"
          colorScheme={is_following ? "gray" : "teal"}
          onClick={() => mutate()}
        >{is_following ? "following" : "follow"}
        </Button>
      </HStack>
    </Box>
  );
}

export function Search() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const username = useAppStore((state) => state.username!);
  const [field, setField] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ['searchResults', { field }],
    queryFn: async (): Promise<AccountResult[]> => {
      const endpoint = '/api/search?' + new URLSearchParams({
        term: field,
        user: username,
      });
      const res = await fetch(endpoint);
      const data = await res.json();
      return data as AccountResult[];
    }
  })

  return (
    <>
      <IconButton
        fontSize="lg"
        colorScheme="teal"
        onClick={onOpen} children={<UserCirclePlus />}
        aria-label={`Search for a user`}
      />
      <Drawer placement="right" onClose={() => {
        onClose()
        setField('')
      }} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth='1px'>Search for a user</DrawerHeader>
          <DrawerBody>
            <>
              <InputGroup>
                <InputLeftElement pointerEvents="none" children={<MagnifyingGlass weight="duotone" />} />
                <Input placeholder="filter by username" onChange={(e) => { console.log("hi"); setField(e.target.value) }} />
              </InputGroup>
              <Divider my="3" />
              {
                isLoading ? <Spinner /> : isError ? <Box>Oops! An error occurred :(</Box> : (
                  <VStack spacing={3}>
                    {
                      data?.map(data => <SearchResult {...data} key={data.follow_link} />)
                    }
                  </VStack>
                )}
            </>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}

