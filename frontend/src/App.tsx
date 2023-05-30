import {
  ChakraProvider,
  Box,
  VStack,
  theme,
  Center,
  Button,
} from "@chakra-ui/react"
import { Card } from '@chakra-ui/react'
import { useState } from "react"
import InfiniteScroll from 'react-infinite-scroller';
import FileUpload from './FileUpload';
import { useForm } from "react-hook-form";
import Nav from "./Nav";
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

const NewPost = () => {
  const {
    handleSubmit,
    register,
    setError,
    control,
    formState: { errors, isSubmitting },
  } = useForm()
  return (
    <Card>
      <FileUpload name="avatar"
        acceptedFileTypes="image/*"
        isRequired={true}
        placeholder="Upload an image..."
        control={control}>
        Make a new post!
      </FileUpload >
      <Button type="submit">
        Post
      </Button>
    </Card>
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
