/* Adapted from https://chakra-templates.dev/navigation/navbar */

import {
  Avatar,
  Box,
  Button,
  Center,
  Flex,
  Link,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  useColorModeValue,
  Image,
  HStack,
} from "@chakra-ui/react";
import { ReactNode, useState } from "react";
import { useNavigate } from "react-router-dom"
import useAppStore from "./appStore";
import { ColorModeSwitcher } from "./ColorModeSwitcher";
import Sticky from 'react-stickynode'
import { Balance } from "./Balance";
import Search from "./Search";

export default function Nav() {
  const username = useAppStore((state) => state.username);
  const signIn = useAppStore((state) => state.signIn);
  const signOut = useAppStore((state) => state.signOut)
  const profilePage = useAppStore((state) => state.profilepage);
  const authUI = useAppStore((state) => state.authUI);
  const setAuthUI = useAppStore((state) => state.setAuthUI);

  const [condition, setCondition] = useState(false);

  return (
    <Sticky innerZ={999}>
      <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <Box>
            <Image
              boxSize='65px'
              borderRadius='full'
              src='https://live.staticflickr.com/65535/52951645298_0e2808d445_n.jpg'
              alt='logo'
            />
          </Box>

          <HStack spacing={3}>
            {username !== undefined && <Balance />}
            {username !== undefined && <Search />}
            <ColorModeSwitcher />
            {username !== undefined &&
              <Menu>
                <MenuButton
                  as={Button}
                  variant={'outline'}
                  cursor={'pointer'}
                  minW={0}>
                  <Avatar
                    size={'sm'}
                    src={'https://avatars.dicebear.com/api/male/username.svg'}
                  />
                </MenuButton>
                <MenuList alignItems={'center'}>
                  <br />
                  <Center>
                    <Avatar
                      size={'2xl'}
                      src={'https://avatars.dicebear.com/api/male/username.svg'}
                    />
                  </Center>
                  <br />
                  <Center>
                    <p>{username}</p>
                  </Center>
                  <br />
                  <MenuDivider />
                  { authUI !== 'profile' ?
                    <MenuItem onClick={() => {
                    profilePage(username)
                    setAuthUI('profile')
                  }}>
                    View Your Profile
                  </MenuItem> :
                    <MenuItem onClick={() => {
                      signIn(username)
                      setAuthUI('login')
                    }}>Return to Feed</MenuItem> }
                  <MenuItem>Your Servers</MenuItem>
                  <MenuItem>Account Settings</MenuItem>
                  <MenuItem onClick={() => {
                    signOut()
                    setAuthUI('login')
                  }}>
                    Logout
                  </MenuItem>
                </MenuList>
              </Menu>
            }
          </HStack>
        </Flex>
      </Box>
    </Sticky>
  );
}

const NavLink = ({ children }: { children: ReactNode }) => (
  <Link
    px={2}
    py={1}
    rounded={'md'}
    _hover={{
      textDecoration: 'none',
      bg: useColorModeValue('gray.200', 'gray.700'),
    }}
    href={'#'}>
    {children}
  </Link>
);

