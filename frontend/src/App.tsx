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
          posts.map(({ username, postDate, imageUrl, tippedAmount }) => (
            <Post username={username}
              postDate={postDate}
              imageUrl={imageUrl}
              tippedAmount={tippedAmount} />
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
