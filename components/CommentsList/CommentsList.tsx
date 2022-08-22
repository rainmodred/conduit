import useComments from '../../hooks/useComments';
import Comment from './Comment/Comment';

export default function CommentsList() {
  const { data: comments, isLoading } = useComments();
  if (isLoading) {
    return <p>Loading...</p>;
  }
  return (
    <>
      {comments?.map(({ id, body, author, createdAt }) => (
        <Comment
          id={id}
          key={id}
          body={body}
          author={author}
          createdAt={createdAt}
        />
      ))}
    </>
  );
}
