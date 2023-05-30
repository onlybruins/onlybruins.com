import { Button, Card } from "@chakra-ui/react";
import { SubmitHandler, useForm } from "react-hook-form";
import FileUpload from "./FileUpload";

const onSubmit: SubmitHandler<{postImage: File}> = ({postImage}) => {
    // TODO: POST to /api/users/:username/posts
    console.log(postImage);
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
