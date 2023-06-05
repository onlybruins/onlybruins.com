import {
  ChakraProvider,
  Box,
  VStack,
  theme,
  Center,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroller";
import Nav from "./Nav";
import NewPost from "./NewPost";
import Post from "./Post";
import useAppStore from './appStore'
import Register from "./Register";
import Login from "./Login";
import Profile from "./ProfilePage"

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

  const fetchData = async () => {
    const endpoint = `/api/users/${username}/feed`;
    const newPosts = await fetch(endpoint).then(res => res.json() as Promise<BackendPost[]>);
    console.log(endpoint)
    console.log(JSON.stringify(newPosts))
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

type Notification = {
  timestamp: string,
  message: string,
}

const pollNotifications = async (username: string, toast: CallableFunction) => {
  fetch(encodeURI(`/api/users/${username}/poll-notifications`), {
    method: 'POST'
  })
    .then(res => res.json())
    .then((notifs: Notification[]) =>
      notifs.forEach(f => {
        toast({
          status: 'info',
          position: 'bottom-right',
          title: f.message,
        });
      }));
}

export const App = () => {
  const username = useAppStore((state) => state.username);
  const authUI = useAppStore((state) => state.authUI);
  const toast = useToast();

  useEffect(() => {
    if (username === undefined) {
      return;
    }
    const timeoutId = setInterval(() => {
      if (username !== undefined) {
        pollNotifications(username, toast);
      }
    }, 500);
    return () => { clearInterval(timeoutId); };
  }, [username, toast]);

  /* return (
     <Profile />
   ) */
  return (
    <ChakraProvider theme={theme}>
      <Nav />
      <br />
      <Box fontSize="xl">
        <Center>
          <VStack spacing={8} width={['100%', '80%', '60%', '40%']}>
            {username === undefined ?
              (authUI === 'register' ? <Register /> : <Login />)
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
