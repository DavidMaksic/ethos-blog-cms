import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { getArticles } from '../services/apiArticles';

export function useFindArticle() {
   const { id } = useParams();
   let articleID = id;

   articleID = id.includes(':') ? id.split(':').at(1) : id;

   const { isPending, data: articles } = useQuery({
      queryKey: ['articles'],
      queryFn: getArticles,
   });

   const article = articles?.find((item) => item.id === Number(articleID));

   return [article, isPending];
}
