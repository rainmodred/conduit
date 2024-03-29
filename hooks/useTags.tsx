import { useQuery } from 'react-query';
import { getTags } from '../utils/api';

export default function useTags() {
  return useQuery('tags', getTags);
}
