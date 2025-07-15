import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateArticle } from '../../services/apiArticles';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export function useEditArticle() {
   const navigate = useNavigate();
   const queryClient = useQueryClient();

   const { isPending: isEditing, mutate: editArticle } = useMutation({
      mutationFn: updateArticle,
      onSuccess: () => [
         toast.success('Article successfully edited'),
         queryClient.invalidateQueries({
            queryKey: ['articles'],
         }),
         navigate(-1),
      ],
      onError: (err) => toast.error(err.message),
   });
   return { isEditing, editArticle };
}
