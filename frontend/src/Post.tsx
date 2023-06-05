import {
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
  Icon,
  Button,
} from "@chakra-ui/react"
import { Card, CardHeader, CardBody, CardFooter } from '@chakra-ui/react'
import { Coins, CurrencyCircleDollar } from "phosphor-react"
import { useState } from "react";

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
            {submit ?
              <Tooltip label={`You've tipped ${tippedAmount} bruinbux`} fontSize='md'>
                <Icon color="#c4aa7e" />
              </Tooltip>
              :
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

export default Post;
