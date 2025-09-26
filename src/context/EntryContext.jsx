import { createContext, useContext, useState } from 'react';
import { useGetCategories } from '../features/tags/useGetCategories';
import { useGetFeaturedArticles } from '../features/features/useGetFeaturedArticles';

const EntryContext = createContext();

function EntryProvider({ children }) {
   const { articles, refetch } = useGetFeaturedArticles();
   refetch();

   const { categories } = useGetCategories();
   const [contextTag, setContextTag] = useState('');

   const currentTag = categories?.find(
      (item) => item.category === contextTag.category
   );

   const taggedArticles = articles?.filter(
      (item) => item.category_id === currentTag?.id && item.featured
   );

   return (
      <EntryContext.Provider
         value={{
            taggedArticles,
            setContextTag,
            refetch,
         }}
      >
         {children}
      </EntryContext.Provider>
   );
}

function useEntry() {
   const context = useContext(EntryContext);

   if (context === undefined)
      throw new Error('EntryContext was used outside of EntryProvider');

   return context;
}

export { EntryProvider, useEntry }; // eslint-disable-line
