import { z } from 'zod';

import Form from '../Shared/Form/Form';
import Avatar from '../Shared/Avatar/Avatar';
import { useAuth } from '../../context/AuthContext';
import { useAddComment } from '../../hooks/useAddComment';

export type CommentFormValues = {
  body: string;
};

const schema = z.object({
  body: z.string().min(1, 'Comment is required'),
});

export default function AddCommentForm() {
  const { user } = useAuth();
  const addCommentMutation = useAddComment();

  function handleSubmit({ body }: CommentFormValues) {
    addCommentMutation.mutate({ body });
  }

  return (
    <Form onSubmit={handleSubmit} schema={schema} className="card comment-form">
      {({ register }) => (
        <>
          <div className="card-block">
            <textarea
              id="comment-textarea"
              {...register('body')}
              className="form-control"
              placeholder="Write a comment..."
              rows={3}
            ></textarea>
          </div>
          <div className="card-footer">
            <Avatar
              className="comment-author-img"
              alt="comment author image"
              src={user?.image as string}
            />
            <button className="btn btn-sm btn-primary">Post Comment</button>
          </div>
        </>
      )}
    </Form>
  );
}
