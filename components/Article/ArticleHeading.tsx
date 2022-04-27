import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMutation, useQueryClient } from 'react-query';
import {
  deleteArticle,
  favoriteArticle,
  followUser,
  unfavoriteArticle,
  unFollowUser,
} from '../../api';
import { useAuth } from '../../context/AuthContext';
import { Article } from '../../types';
import DeleteButton from '../Buttons/DeleteButton/DeleteButton';
import EditButton from '../Buttons/EditButton/EditButton';
import FavoriteArticleButton from '../Buttons/FavoriteButton/FavoriteButton';
import FollowButton from '../Buttons/FollowButton/FollowButton';

interface ArticleHeadingProps {
  slug: string;
  heading: string;
  authorUsername: string;
  authorImage: string;
  createdAt: string;
  favorited: boolean;
  favoriteCount: number;
  following: boolean;
}

export default function ArticleHeading({
  slug,
  heading,
  authorUsername,
  authorImage,
  createdAt,
  favorited,
  favoriteCount,
  following,
}: ArticleHeadingProps): JSX.Element {
  const { user } = useAuth();
  const { push } = useRouter();
  const queryClient = useQueryClient();
  const query = ['article', `${slug}`];

  const followMutation = useMutation(
    () =>
      following
        ? unFollowUser(authorUsername, user?.token as string)
        : followUser(authorUsername, user?.token as string),
    {
      onMutate: async () => {
        await queryClient.cancelQueries(query);
        const previousValue = queryClient.getQueryData<Article>(query);

        if (previousValue) {
          queryClient.setQueryData<Article>(query, {
            ...previousValue,
            author: {
              ...previousValue.author,
              following: !previousValue.author.following,
            },
          });
        }

        return { previousValue };
      },
      onError: (err, variables, context) => {
        if (context?.previousValue) {
          queryClient.setQueryData<Article>(query, context.previousValue);
        }
      },

      onSettled: () => {
        queryClient.invalidateQueries(query);
      },
    },
  );

  const favoriteMutation = useMutation(
    () =>
      favorited
        ? unfavoriteArticle(slug, user?.token as string)
        : favoriteArticle(slug, user?.token as string),
    {
      onMutate: async () => {
        await queryClient.cancelQueries(query);
        const previousValue = queryClient.getQueryData<Article>(query);

        let favoritesCount = 0;
        if (previousValue && Number.isInteger(previousValue?.favoritesCount)) {
          favoritesCount = favorited
            ? previousValue.favoritesCount - 1
            : previousValue.favoritesCount + 1;
        }

        if (previousValue) {
          queryClient.setQueryData<Article>(query, {
            ...previousValue,
            favorited: !previousValue.favorited,
            favoritesCount,
          });
        }

        return { previousValue };
      },
      onError: (err, variables, context) => {
        if (context?.previousValue) {
          queryClient.setQueryData<Article>(query, context.previousValue);
        }
      },

      onSettled: () => {
        queryClient.invalidateQueries(query);
      },
    },
  );

  const deleteMutation = useMutation(
    () => deleteArticle(slug, user?.token as string),
    {
      onMutate: () => {
        push('/');
      },
    },
  );

  const isAuthor = user?.username === authorUsername;

  function handleFollowClick() {
    if (!user) {
      push('/register');
      return;
    }
    followMutation.mutate();
  }

  function handleFavoriteClick() {
    if (!user) {
      push('/register');
      return;
    }
    favoriteMutation.mutate();
  }

  function handleDeleteArticle() {
    deleteMutation.mutate();
  }

  const isDisabled =
    followMutation.isLoading ||
    favoriteMutation.isLoading ||
    deleteMutation.isLoading;

  return (
    <div className="banner">
      <div className="container">
        <h1>{heading}</h1>

        <div className="article-meta">
          <Link href={`/profile/${authorUsername}`}>
            <a style={{ verticalAlign: 'middle' }}>
              <Image
                src={authorImage}
                alt="author avatar"
                width="32"
                height="32"
              />
            </a>
          </Link>
          <div className="info">
            <Link href={`/profile/${authorUsername}`}>
              <a href="" className="author">
                {authorUsername}
              </a>
            </Link>

            <span className="date">{createdAt}</span>
          </div>

          {isAuthor ? (
            <span>
              <EditButton slug={slug} type="article" />
              &nbsp;&nbsp;
              <DeleteButton
                onClick={handleDeleteArticle}
                disabled={isDisabled}
              />
            </span>
          ) : (
            <span>
              <FollowButton
                followed={following}
                onClick={handleFollowClick}
                disabled={isDisabled}
              >
                {authorUsername}
              </FollowButton>
              &nbsp;&nbsp;
              <FavoriteArticleButton
                favorited={favorited}
                size="lg"
                disabled={isDisabled}
                onClick={handleFavoriteClick}
              >
                {favoriteCount}
              </FavoriteArticleButton>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
