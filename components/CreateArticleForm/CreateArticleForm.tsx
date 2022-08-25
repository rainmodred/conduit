import { useState } from 'react';
import { z } from 'zod';
import useCreateArticle from '../../hooks/useCreateArticle';

import Button from '../Shared/Button/Button';
import Form from '../Shared/Form/Form';
import InputField from '../Shared/Form/InputField/InputField';

export type Values = {
  title: string;
  description: string;
  body: string;
  tagList: string;
};

const schema = z.object({
  title: z.string().min(1, 'title is required'),
  description: z.string().min(1, 'description is required'),
  body: z.string().min(1, 'body is required'),
  tagList: z.string(),
});

export default function CreateArticleForm() {
  const [isFormDisabled, setIsFormDisabled] = useState(false);

  const articleMutation = useCreateArticle();

  function handleSubmit({ title, description, body, tagList }: Values) {
    setIsFormDisabled(true);
    articleMutation.mutate({
      title: title.trim(),
      description: description.trim(),
      body: body.trim(),
      tagList: tagList
        .trim()
        .split(' ')
        .map(i => i.trim()),
    });
  }

  return (
    <Form onSubmit={handleSubmit} schema={schema}>
      {({ register }) => (
        <>
          <InputField
            size="lg"
            disabled={isFormDisabled}
            label="title"
            registration={register('title')}
            placeholder="Article title"
          />
          <InputField
            disabled={isFormDisabled}
            label="description"
            placeholder="What's this article about?"
            registration={register('description')}
          />
          <fieldset className="form-group">
            <textarea
              disabled={isFormDisabled}
              className="form-control"
              rows={8}
              placeholder="Write your article (in markdown)"
              {...register('body')}
            />
          </fieldset>
          <InputField
            disabled={isFormDisabled}
            label="tags"
            placeholder="Enter tags"
            registration={register('tagList')}
          />

          <Button>Publish Article</Button>
        </>
      )}
    </Form>
  );
}
