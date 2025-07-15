import { getArticles } from '../../services/apiArticles';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

export function useFindArticle() {
   const { id } = useParams();
   let articleID = id;

   articleID = id.includes(':') ? id.split(':').at(1) : id;

   const { isPending, data: { data: articles } = {} } = useQuery({
      queryFn: getArticles,
      queryKey: ['articles'],
   });

   const article = articles?.find((item) => item.id === Number(articleID));

   return { article, isPending };
}
