import { createArticle as createArticleAPI } from '../../services/apiArticles';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export function useCreateArticle() {
   const navigate = useNavigate();
   const queryClient = useQueryClient();

   const { isPending, mutate: createArticle } = useMutation({
      mutationFn: createArticleAPI,
      onSuccess: () => [
         toast.success('New article successfully created'),
         queryClient.invalidateQueries({
            queryKey: ['articles'],
         }),
         navigate('/archive'),
      ],
      onError: (err) => toast.error(err.message),
   });

   return { isPending, createArticle };
}
