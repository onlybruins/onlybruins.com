import {
  ChakraProvider,
  Box,
  VStack,
  theme,
  Center,
  Heading,
  HStack,
  Image,
  Tooltip,
  Flex,
  Spacer,
  Input,
  InputLeftElement,
  InputRightElement,
  InputGroup,
  Button,
  Card,
  CardHeader,
  CardBody,
  Grid,
  Icon
} from "@chakra-ui/react";
import { useState } from "react";
import InfiniteScroll from "react-infinite-scroller";
import Nav from "./Nav";
import NewPost from "./NewPost";
// import { Post } from "./Post";

interface PostProps {
  imageUrl: string,
  postDate: string,
  username: string,
}

const Post = ({ imageUrl, postDate, username }: PostProps) => {
  const [tippedAmount, setTippedAmount] = useState('');
  const [submit, setSubmit] = useState(false);

  const handleChange = (event: any) => {
    setTippedAmount(event.target.value);
  }

  const handleSubmit = () => {
    if (!isNaN(Number(tippedAmount)) && (Number(tippedAmount) > 0)) {
      setSubmit(!submit);
    }
  }

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
        <Image borderRadius="8px" boxSize="100%" src={imageUrl} mb="10px" />
        <InputGroup>
          <InputLeftElement
            pointerEvents='none'
            color='gray.300'
            fontSize='1.2em'
            children='$'
          />
          <Input
            value={tippedAmount}
            onChange={handleChange}
            placeholder='How much would you like to tip?' />
          <InputRightElement width='4.5rem'>
            {submit ? <Tooltip label={`You've tipped ${tippedAmount} bruinbux`} fontSize='md'>
              <Icon color="#c4aa7e" />
            </Tooltip> :
              <Button h='1.75rem' size='sm'
                onClick={handleSubmit}>
                Tip
              </Button>
            }
          </InputRightElement>
        </InputGroup>
      </CardBody>
    </Card>
  )
}

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


/* <HStack paddingTop="1rem">
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

  */
