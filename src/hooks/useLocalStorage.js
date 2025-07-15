import { useEffect, useState } from 'react';

export function useLocalStorage(initialState, key) {
   const [value, setValue] = useState(() => {
      const storedValue = localStorage.getItem(key);
      return storedValue ? JSON.parse(storedValue) : initialState;
   });

   useEffect(() => {
      localStorage.setItem(key, JSON.stringify(value));
   }, [value, key]);

   function remove() {
      localStorage.removeItem(key);
   }

   return [value, setValue, remove];
}
