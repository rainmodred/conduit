import { useRouter } from 'next/router';

export default function usePagination(totalPages: number) {
  const { query } = useRouter();
  const range = Array.from({ length: totalPages }, (_, i) => i + 1);

  const activePage = Number(query?.page) || 1;

  return {
    range,
    activePage,
  };
}
