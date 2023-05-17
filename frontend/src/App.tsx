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
import { useState } from "react"
import InfiniteScroll from 'react-infinite-scroller';

interface PostProps {
  username: string,
  postDate: string,
  imageUrl: string,
  tippedAmount?: number,
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
          <Heading textAlign='left' size='sm' fontWeight='normal' color="grey">{postDate}</Heading>
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

const Feed = () => {
  const [posts, setPosts] = useState([]);

  const fetchData = () => {
    console.log('fetching...')
    const endpoint = '/api/fakePosts';
    // const endpoint = 'localhost:3070/api/fakePosts';
    const newPostsP = fetch(endpoint).then(res => res.json());
    newPostsP.then(newPosts => {
      console.log('done')
      setPosts(posts.concat(newPosts))
    });
  }

  return (
    <div>
      <InfiniteScroll
        loadMore={fetchData}
        hasMore={true}
      >
        {
          posts.map(({ username, postDate, imageUrl, tippedAmount }: PostProps) => (
            <Post username={username}
              postDate={postDate}
              imageUrl={imageUrl}
              tippedAmount={tippedAmount} />
          ))
        }
      </InfiniteScroll>
    </div>
  )
}


export const App = () => (
  <ChakraProvider theme={theme}>
    <Box textAlign="center" fontSize="xl">
      <Grid minH="100vh" p={3}>
        <ColorModeSwitcher justifySelf="flex-end" />
        <VStack spacing={8}>
          <Post username="@mzzzchael" postDate={'December 17, 1995 03:24:00'} imageUrl="https://www.tasteofhome.com/wp-content/uploads/2018/04/grilledcheesesocial-copy.jpg" tippedAmount={3} />
          <Post username="@tb" postDate={'December 17, 2021 03:24:00'} imageUrl="https://spoonuniversity.com/wp-content/uploads/sites/55/2016/01/FullSizeRender-4.jpg" />
          <Feed />
        </VStack>
      </Grid>
    </Box>
  </ChakraProvider>
)
