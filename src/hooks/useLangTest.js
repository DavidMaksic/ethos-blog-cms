import { useEffect, useState } from 'react';

function useLangText(array, language) {
   const [filteredArray, setFilteredArray] = useState();
   const cyrillicPattern = /^\p{Script=Cyrillic}+$/u;

   useEffect(() => {
      const filterItems = array?.filter((item) => {
         if (language === 'Српски') {
            return cyrillicPattern.test(item.category);
         } else {
            return !cyrillicPattern.test(item.category);
         }
      });

      setFilteredArray(filterItems);
   }, [language]); // eslint-disable-line

   return filteredArray;
}

export default useLangText;
