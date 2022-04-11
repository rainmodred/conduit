import { useQuery } from 'react-query';
import { getTags } from '../api';

export default function useTags() {
  return useQuery('tags', getTags);
}
