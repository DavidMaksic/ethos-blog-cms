import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { updateArticle } from '../../services/apiArticles';
import toast from 'react-hot-toast';

export function useEditArticle() {
   const navigate = useNavigate();
   const queryClient = useQueryClient();

   const { id } = useParams();
   let articleID = id;
   articleID = id.includes(':') ? id.split(':').at(1) : id;

   const { isPending: isEditing, mutate: editArticle } = useMutation({
      mutationFn: updateArticle,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['article', articleID] });
         toast.success('Article successfully edited');
         navigate(-1);
      },
      onError: (err) => toast.error(err.message),
   });

   return { isEditing, editArticle };
}
