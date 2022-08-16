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
} from '../../../utils/api';
import { useAuth } from '../../../context/AuthContext';
import { Article } from '../../../utils/types';
import DeleteButton from '../../Shared/Buttons/DeleteButton/DeleteButton';
import EditButton from '../../Shared/Buttons/EditButton/EditButton';
import FollowButton from '../../Shared/Buttons/FollowButton/FollowButton';
import FavoriteArticleButton from '../../Shared/Buttons/FavoriteButton/FavoriteButton';

interface ArticleHeadingProps {
  slug: string;
  title: string;
  favorited: boolean;
  createdAt: string;
  favoriteCount: number;
  author: {
    username: string;
    image: string;
    following: boolean;
  };
}

export default function ArticleHeading(
  props: ArticleHeadingProps,
): JSX.Element {
  const { slug, title, createdAt, favorited, favoriteCount, author } = props;
  const { user } = useAuth();
  const { push } = useRouter();
  const queryClient = useQueryClient();
  const query = ['article', `${slug}`];
  // console.log('props', props);
  const followMutation = useMutation(
    () =>
      author.following
        ? unFollowUser(author.username, user?.token as string)
        : followUser(author.username, user?.token as string),
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
          // console.log('error', err, variables, context);
          queryClient.setQueryData<Article>(query, context.previousValue);
        }
      },

      onSuccess: data => {
        // Better keys?
        queryClient.invalidateQueries(['articles', 'feed', 1]);
        // console.log('data', data);
        // queryClient.setQueryData<Article>(query, oldData => {
        //   // console.log('oldData', oldData);
        //   return {
        //     ...oldData,
        //     author: { ...data.profile },
        //   };
        // });
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

  const isAuthor = user?.username === author.username;

  function handleFollowClick() {
    if (!user) {
      push('/register');
      return;
    }

    // if (author.following) {
    //   unfollowMutation.mutate();
    // } else {
    followMutation.mutate();
    // }
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
        <h1>{title}</h1>

        <div className="article-meta">
          <Link href={`/profile/${author.username}`}>
            <a style={{ verticalAlign: 'middle' }}>
              <Image
                src={author.image}
                alt="author avatar"
                width="32"
                height="32"
              />
            </a>
          </Link>
          <div className="info">
            <Link href={`/profile/${author.username}`}>
              <a href="" className="author">
                {author.username}
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
                followed={author.following}
                onClick={handleFollowClick}
                disabled={isDisabled}
              >
                {author.username}
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
