import Link from 'next/link';
import React from 'react';
import { Comment as IComment } from '../../utils/types';
import Avatar from '../Shared/Avatar/Avatar';

type CommentProps = Pick<IComment, 'body' | 'author' | 'createdAt'>;

export default function Comment({ body, author, createdAt }: CommentProps) {
  return (
    <div className="card">
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
          <i className="ion-edit"></i>
          <i className="ion-trash-a"></i>
        </span>
      </div>
    </div>
  );
}
