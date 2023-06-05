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
  tip_endpoint: string,
}

const Feed = () => {
  const username = useAppStore((state) => state.username);
  const [posts, setPosts] = useState<BackendPost[]>([]);
  const [postTips, setPostTips] = useState<{ [tipEndpoint: string]: (number | undefined) }>({});

  const fetchData = () => {
    const endpoint = '/api/users/T%20Omegalul%20M/posts';
    const newPostsP = fetch(endpoint).then(res => res.json() as Promise<BackendPost[]>);
    newPostsP.then(newPosts => {
      setPosts(posts.concat(newPosts));
      // get the amounts the logged-in user has tipped to each new post
      Promise.all(
        newPosts.map(p =>
          fetch(`${p.tip_endpoint}/${username}`)
            .then(res => res.status === 200 ? res.json().then(json => json.amount) : Promise.resolve(null))
        )
      ).then(resps => {
        let nextPostTips = { ...postTips };
        resps.forEach((tipValue, i) => {
          if (tipValue !== null) {
            nextPostTips[newPosts[i].tip_endpoint] = tipValue;
          }
        });
        setPostTips(nextPostTips);
      });
    });
  }

  const tipPost = (tip_endpoint: string, amount: number) => {
    fetch(tip_endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tipper_username: username, amount: amount }),
    })
      .then(res => {
        if (res.status === 200) {
          setPostTips({ ...postTips, [tip_endpoint]: amount });
        }
        else {
          res.json().then(json => alert(`Failed to tip: ${json}`));
        }
      });
  }

  return (
    <InfiniteScroll
      loadMore={fetchData}
      hasMore={true}
    >
      <VStack spacing={8}>
        {
          posts.map(({ image_endpoint, poster_username, timestamp, tip_endpoint }) => (
            <Post username={poster_username}
              postDate={timestamp}
              imageUrl={image_endpoint}
              setTipAmount={(n: number) => tipPost(tip_endpoint, n)}
              tipAmount={postTips[tip_endpoint]} />
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
