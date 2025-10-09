import { getArticle } from '../../services/apiArticles';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

export function useFindArticle() {
   const { id } = useParams();
   let articleID = id;
   articleID = id.includes(':') ? id.split(':').at(1) : id;

   const { isPending, data: article } = useQuery({
      queryKey: ['articles'],
      queryFn: () => getArticle(articleID),
   });

   return { article, isPending };
}
