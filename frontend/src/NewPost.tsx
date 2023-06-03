import { Button, Card } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import FileUpload from "./FileUpload";

const username = 'T Omegalul M';

const onSubmit = (data: {postImage: File}) => {
    const formData = new FormData();
    formData.append('postImage', data.postImage);
    fetch(encodeURI(`/api/users/${username}/posts`), {
      method: "POST",
      body: formData
    })
    .then(res => res.json())
    .then(json => console.log('response:', json))
    .catch(console.error);
}

export const NewPost = () => {
    const {
      handleSubmit,
      register,
      setError,
      control,
      formState: { errors, isSubmitting },
    } = useForm<{postImage: File}>();
    return (
      <Card width='100%'>
        <FileUpload name="postImage"
          acceptedFileTypes="image/*"
          isRequired={true}
          placeholder="Upload an image..."
          control={control}>
          Make a new post!
        </FileUpload >
        <Button type="submit"
          onClick={handleSubmit(onSubmit)}>
          Post
        </Button>
      </Card>
    )
  }

export default NewPost;
