import {
  ChakraProvider,
  Box,
  VStack,
  theme,
  Center,
} from "@chakra-ui/react";
import { useState } from "react";
import InfiniteScroll from "react-infinite-scroller";
import Nav from "./Nav";
import NewPost from "./NewPost";
import Post from "./Post";
import Reg from "./Login";
import useAppStore from './appStore'

interface BackendPost {
  post_endpoint: string,
  poster_name: string,
  poster_username: string,
  image_endpoint: string,
  timestamp: string,
  tippedAmount?: number,
}

const Feed = () => {
  const [posts, setPosts] = useState<BackendPost[]>([]);

  const fetchData = () => {
    const endpoint = '/api/fakePosts';
    const newPostsP = fetch(endpoint).then(res => res.json());
    newPostsP.then(newPosts => {
      setPosts(posts.concat(newPosts))
    });
  }

  return (
    <InfiniteScroll
      loadMore={fetchData}
      hasMore={true}
    >
      <VStack spacing={8}>
        {
          posts.map(({ image_endpoint, poster_username, timestamp }) => (
            <Post username={poster_username}
              postDate={timestamp}
              imageUrl={image_endpoint} />
          ))
        }
      </VStack>
    </InfiniteScroll>
  )
}

export const App = () => {
  const username = useAppStore((state) => state.username);

  return (
    <ChakraProvider theme={theme}>
      <Nav />
      <br />
      <Box fontSize="xl">
        <Center>
          <VStack spacing={8} width={['100%', '80%', '60%', '40%']}>
            {username === undefined ?
              <Reg />
              :
              <>
                <NewPost />
                <Feed />
              </>
            }
          </VStack>
        </Center>
      </Box>
    </ChakraProvider>
  )
}
