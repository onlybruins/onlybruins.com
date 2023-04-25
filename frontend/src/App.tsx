import * as React from "react"
import {
  ChakraProvider,
  Box,
  VStack,
  Grid,
  theme,
  Heading,
  HStack,
  Image,
  Tooltip,
  Flex,
  Spacer,
} from "@chakra-ui/react"
import { Card, CardHeader, CardBody, CardFooter } from '@chakra-ui/react'
import { ColorModeSwitcher } from "./ColorModeSwitcher"
import { Logo } from "./Logo"
import { Coins } from "phosphor-react";

interface PostProps {
  username: string,
  postDate: Date,
  imageUrl: string,
  tippedAmount?: string,
}
const Post = ({
  username, postDate, imageUrl, tippedAmount
}: PostProps) => {
  return (
    <Card>
      <CardHeader paddingBottom="0px">
        <Flex>
          <Heading textAlign='left' size='sm'>{username}</Heading>
          <Spacer />
          <Heading textAlign='left' size='sm' fontWeight='normal' color="grey">{postDate.toDateString()}</Heading>
        </Flex>
      </CardHeader>
      <CardBody>
        <Image borderRadius="8px" boxSize="500px" src={imageUrl} />
        <HStack paddingTop="1rem">
          {
            tippedAmount ?
              <Tooltip label={`You've tipped ${tippedAmount} bruinbux`} fontSize='md'>
                <Coins color="#c4aa7e" weight="fill" size={24} />
              </Tooltip>
              :
              <Tooltip label={`Tip bruinbux to ${username}!`} fontSize='md'>
                <Coins color="#c4aa7e" weight="regular" size={24} />
              </Tooltip>
          }
        </HStack>
      </CardBody>
    </Card>
  )
}

export const App = () => (
  <ChakraProvider theme={theme}>
    <Box textAlign="center" fontSize="xl">
      <Grid minH="100vh" p={3}>
        <ColorModeSwitcher justifySelf="flex-end" />
        <VStack spacing={8}>
          <Post username="@mzzzchael" postDate={new Date('December 17, 1995 03:24:00')} imageUrl="https://www.tasteofhome.com/wp-content/uploads/2018/04/grilledcheesesocial-copy.jpg" tippedAmount="3" />
          <Post username="@tb" postDate={new Date('December 17, 2021 03:24:00')} imageUrl="https://spoonuniversity.com/wp-content/uploads/sites/55/2016/01/FullSizeRender-4.jpg" />
        </VStack>
      </Grid>
    </Box>
  </ChakraProvider>
)
