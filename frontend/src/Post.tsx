import {
  Heading,
  Image,
  Tooltip,
  Flex,
  Spacer,
  Input,
  InputLeftElement,
  InputGroup,
  Button,
  useColorModeValue,
  HStack,
  Text,
  useToken,
} from "@chakra-ui/react"
import { Card, CardHeader, CardBody } from '@chakra-ui/react'
import { ArrowCircleRight, Coins, CurrencyCircleDollar } from "phosphor-react"
import { useRef } from "react";
import moment from "moment";

interface PostProps {
  imageUrl: string,
  postDate: string,
  setTipAmount: (amount: number) => void,
  tipAmount?: number,
  username: string,
}

const Post = ({ imageUrl, postDate, username, tipAmount, setTipAmount }: PostProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const color = useColorModeValue('yellow.600', 'yellow.400')
  const [rgb] = useToken('colors', [color])

  const handleSubmit = () => {
    const n = Number(inputRef.current?.value);
    if (!isNaN(n) && n > 0) {
      setTipAmount(n);
    }
  }

  const dateString = moment(postDate).fromNow();

  return (
    <Card>
      <CardHeader paddingBottom="0px">
        <Flex>
          <Heading textAlign='left' size='sm'>{username}</Heading>
          <Spacer />
          <Heading textAlign='left' size='sm' fontWeight='normal' color="grey">{dateString}</Heading>
        </Flex>
      </CardHeader>
      <CardBody>
        <Image borderRadius="8px" boxSize="100%" src={imageUrl} mb="10px" />
        <HStack>
          <InputGroup>
            <InputLeftElement
              pointerEvents='none'
              color='gray.300'
              children={
                <CurrencyCircleDollar
                  size="24px"
                  weight={tipAmount === undefined ? "regular" : "duotone"}
                  color={rgb}
                />
              }
            />
            {tipAmount === undefined ?
              <Input
                placeholder='How much would you like to tip?'
                ref={inputRef}
              />
              :
              <Input
                placeholder={`You've tipped ${tipAmount} bruinbux`}
                disabled
              />
            }
          </InputGroup>
          {tipAmount === undefined &&
            <Button
              onClick={handleSubmit}>
              <ArrowCircleRight weight="fill" size="24px" />
            </Button>
          }
        </HStack>
      </CardBody>
    </Card>
  )
}

export default Post;
