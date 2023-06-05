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
import { useState } from "react";

interface PostProps {
  imageUrl: string,
  postDate: string,
  username: string,
}

const Post = ({ imageUrl, postDate, username }: PostProps) => {
  const [tipField, setTipField] = useState('');
  const [tip, setTip] = useState<number | undefined>(undefined);
  const color = useColorModeValue('yellow.600', 'yellow.400')
  const [rgb] = useToken('colors', [color])

  const handleChange = (event: any) => {
    setTipField(event.target.value);
  }

  const handleSubmit = () => {
    const n = Number(tipField)
    /* TODO: check if has enough in balance */
    if (!isNaN(n) && n > 0) {
      setTip(n);
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
        <HStack>
          <InputGroup>
            <InputLeftElement
              pointerEvents='none'
              color='gray.300'
              children={
                <CurrencyCircleDollar
                  size="1.5rem"
                  weight={tip === undefined ? "regular" : "duotone"}
                  color={rgb}
                />
              }
            />
            {tip === undefined ?
              <Input
                value={tipField}
                onChange={handleChange}
                placeholder='How much would you like to tip?'
              />
              :
              <Input
                value={`You've tipped ${tip} bruinbux`}
                disabled
              />
            }
          </InputGroup>
          {tip === undefined &&
            <Button
              onClick={handleSubmit}>
              <ArrowCircleRight weight="fill" size="1.5rem" />
            </Button>
          }
        </HStack>
      </CardBody>
    </Card>
  )
}

export default Post;
