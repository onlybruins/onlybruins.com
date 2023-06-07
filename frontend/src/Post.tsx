import {
  Heading,
  Image,
  Flex,
  Spacer,
  Input,
  InputLeftElement,
  InputGroup,
  Button,
  useColorModeValue,
  HStack,
  useToken,
} from "@chakra-ui/react"
import { Card, CardHeader, CardBody } from '@chakra-ui/react'
import { ArrowCircleRight, CurrencyCircleDollar } from "phosphor-react"
import { useState } from "react";
import moment from "moment";

interface PostProps {
  imageUrl: string,
  postDate: string,
  setTipAmount: (amount: number) => void,
  tipAmount?: number,
  username: string,
}

const Post = ({ imageUrl, postDate, username, tipAmount, setTipAmount }: PostProps) => {
  const [tipField, setTipField] = useState("");
  const color = useColorModeValue('yellow.600', 'yellow.400')
  const [rgb] = useToken('colors', [color])

  const handleSubmit = () => {
    const n = Number(tipField);
    if (!isNaN(n) && n > 0) {
      setTipAmount(n);
    }
  }

  const dateString = moment(postDate).fromNow();

  return (
    <Card width='full'>
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
                onChange={(e) => setTipField(e.target.value)}
              />
              :
              <Input
                value={`You've tipped ${tipAmount} bruinbux`}
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
