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
  CheckboxIcon,
  Center,
  Button,
} from "@chakra-ui/react"
import { Card, CardHeader, CardBody, CardFooter } from '@chakra-ui/react'
import { Coins } from "phosphor-react"

interface PostProps {
  username: string,
  postDate: string,
  imageUrl: string,
  tippedAmount?: number,
}

export const Post = ({
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
        <Image borderRadius="8px" boxSize="500px" src={imageUrl} />
        <InputGroup>
          <InputLeftElement
            pointerEvents='none'
            color='gray.300'
            fontSize='1.2em'
            children='$'
          />
          <Input placeholder='How much would you like to tip?' />
          <InputRightElement>
            <CheckboxIcon color='green.500' />
          </InputRightElement>
        </InputGroup>
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
