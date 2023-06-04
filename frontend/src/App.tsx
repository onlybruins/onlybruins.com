import {
  ChakraProvider,
  Box,
  VStack,
  theme,
  Center
} from "@chakra-ui/react";
import { useState } from "react"
import InfiniteScroll from "react-infinite-scroller";
import Nav from "./Nav";
import NewPost from "./NewPost";
import { Post } from "./Post";

const Feed = () => {
  const [posts, setPosts] = useState([]);

  const fetchData = () => {
    const endpoint = '/api/users/T%20Omegalul%20M/posts';
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
          posts.map(({ poster_username, timestamp, image_endpoint }) => (
            <Post username={poster_username}
              postDate={timestamp}
              imageUrl={image_endpoint}
              tippedAmount={100} />
          ))
        }
      </VStack>
    </InfiniteScroll>
  )
}

export const App = () => (
  <ChakraProvider theme={theme}>
    <Nav />
    <br />
    <Box fontSize="xl">
      <Center>
        <VStack spacing={8} width={['100%', '80%', '60%', '40%']}>
          <NewPost />
          <Feed />
        </VStack>
      </Center>
    </Box>
  </ChakraProvider>
)
