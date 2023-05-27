import * as React from "react"
import {
  ChakraProvider,
  Input,
  Box,
  Button,
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
import { Coins } from "phosphor-react";
import { useState } from "react"
import InfiniteScroll from 'react-infinite-scroller';
import FileUpload from './FileUpload';
import { useForm } from "react-hook-form";

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
        <Image borderRadius="8px" width="100%" src={imageUrl} />
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
    const endpoint = '/api/fakePosts';
    const newPostsP = fetch(endpoint).then(res => res.json());
    newPostsP.then(newPosts => {
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

const NewPost = () => {
  const {
    handleSubmit,
    register,
    setError,
    control,
    formState: { errors, isSubmitting },
  } = useForm()
  return (
    <FileUpload name="avatar"
      acceptedFileTypes="image/*"
      isRequired={true}
      placeholder="Upload an image..."
      control={control}>
      Make a new post!
    </FileUpload >
  )
}

export const App = () => (
  <ChakraProvider theme={theme}>
    <Box textAlign="center" fontSize="xl">
      <Grid minH="100vh" p={3}>
        <ColorModeSwitcher justifySelf="flex-end" />
        <VStack align="center" spacing={8} width='100%' px="24vw">
          <NewPost />
          <Feed />
        </VStack>
      </Grid>
    </Box>
  </ChakraProvider>
)
