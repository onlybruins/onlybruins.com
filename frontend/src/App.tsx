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
} from "@chakra-ui/react"
import { ColorModeSwitcher } from "./ColorModeSwitcher"
import { useState } from "react"
import InfiniteScroll from "react-infinite-scroller";
import Nav from "./Nav";
import NewPost from "./NewPost";
// import { Post } from "./Post";



interface PostProps {
  username: string,
  postDate: string,
  imageUrl: string,
//  tippedAmount?: number,
}

const Post = ({ user, image, date } : any) => {
  const [username, setUsername] = useState(user);
  const [imageUrl, setImageUrl] = useState(image);
  const [postDate, setPostDate] = useState(date);
  const [tippedAmt, setTippedAmt] = useState('');
  const [submit, setSubmit] = useState(false);

  const handleChange = (event:any) => {
    setTippedAmt(event.target.value)
  }
  
  const handleSubmit = () => {
    if(!isNaN(Number(tippedAmt)) && (Number(tippedAmt) > 0) ) {
      setSubmit(!submit)
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
        <Image borderRadius="8px" boxSize="500px" src={imageUrl} />
        <InputGroup>
          <InputLeftElement 
            pointerEvents='none'
            color='gray.300'
            fontSize='1.2em'
            children='$' 
          />
          <Input 
            value={tippedAmt}
            onChange={handleChange}
            placeholder='How much would you like to tip?' />
          <InputRightElement width='4.5rem'>
            {submit ? <Tooltip label={`You've tipped ${tippedAmt} bruinbux`} fontSize='md'>
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
          posts.map(({ username, postDate, imageUrl }: PostProps) => (
            <Post user={username}
              date={postDate}
              image={imageUrl} />
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
        <VStack spacing={8} width={['100%', '80%', '60%', '40%']} />
      </Center>  
          <NewPost />
    </Box>      
    <Box textAlign="center" fontSize="xl"> 
      <Center>   
      <Grid minH="100vh" p={3}>
        <ColorModeSwitcher justifySelf="flex-end" />
        <VStack spacing={8}>
          <Post user="@mzzzchael" date={'December 17, 1995 03:24:00'} image="https://www.tasteofhome.com/wp-content/uploads/2018/04/grilledcheesesocial-copy.jpg" />
          <Post user="@tb" date={'December 17, 2021 03:24:00'} image="https://spoonuniversity.com/wp-content/uploads/sites/55/2016/01/FullSizeRender-4.jpg" />
          <Feed />
        </VStack>
      </Grid> 
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