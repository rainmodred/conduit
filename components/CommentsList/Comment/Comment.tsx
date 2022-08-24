import Link from 'next/link';
import React from 'react';

import { useAuth } from '../../../context/AuthContext';
import { useDeleteCommentMutation } from '../../../hooks/useDeleteCommentMutation';
import { Comment as IComment } from '../../../utils/types';
import Avatar from '../../Shared/Avatar/Avatar';

type CommentProps = Pick<IComment, 'id' | 'body' | 'author' | 'createdAt'>;

export default function Comment({ id, body, author, createdAt }: CommentProps) {
  const { user } = useAuth();
  const deleteCommentMutation = useDeleteCommentMutation(id);

  function handleDelete() {
    deleteCommentMutation.mutate();
  }

  const isAuthor = user?.username === author?.username;

  return (
    <div data-testid="comment" className="card">
      <div className="card-block">
        <p className="card-text">{body}</p>
      </div>
      <div className="card-footer">
        <Link href={`${author.username}`}>
          <a className="comment-author">
            <Avatar
              src={author.image}
              alt={'comment author avatar'}
              className="comment-author-img"
            />
          </a>
        </Link>
        &nbsp;
        <Link href={`${author.username}`}>
          <a className="comment-author">{author.username}</a>
        </Link>
        <span className="date-posted">{createdAt}</span>
        <span className="mod-options">
          {isAuthor ? (
            <i
              onClick={handleDelete}
              data-testid="delete-comment"
              className="ion-trash-a"
            ></i>
          ) : null}
        </span>
      </div>
    </div>
  );
}
