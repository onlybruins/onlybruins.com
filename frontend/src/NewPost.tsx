import { Button, Card, useToast } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import useAppStore from "./appStore";
import FileUpload from "./FileUpload";

export const NewPost = () => {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<{ postImage: File }>();

  const username = useAppStore((state) => state.username!);

  const onSubmit = (data: { postImage: File }, callback: ((a: 'success' | 'error') => void)) => {
    const formData = new FormData();
    formData.append('postImage', data.postImage);
    fetch(encodeURI(`/api/users/${username}/posts`), {
      method: "POST",
      body: formData
    })
      .then(res => res.json())
      .then(json => {
        console.log('response:', json)
        callback('success')
      })
      .catch((e) => {
        console.error(e)
        callback('error')
      }).finally(() => reset());
  }

  const toast = useToast();
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
        isLoading={isSubmitting}
        onClick={handleSubmit((data) => onSubmit(data, (status) => {
          toast({
            status: status,
            title: status === 'success' ? "posted successfully!" : "could not post :(",
          })
        }))}>
        Post
      </Button>
    </Card>
  )
}

export default NewPost;
