import { deleteArticle as deleteArticleAPI } from '../../services/apiArticles';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export function useDeleteArticle() {
   const queryClient = useQueryClient();

   const {
      isPending: isDeleting,
      isSuccess,
      mutate: deleteArticle,
   } = useMutation({
      mutationFn: deleteArticleAPI,
      onSuccess: () => {
         toast.success('Article successfully deleted');
         queryClient.invalidateQueries({
            queryKey: ['articles'],
         });
      },
      onError: (err) => toast.error(err.message),
   });
   return { isDeleting, isSuccess, deleteArticle };
}
