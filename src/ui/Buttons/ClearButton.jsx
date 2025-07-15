import { LuEraser } from 'react-icons/lu';

function ClearButton({ handler, editor, style }) {
   function handleClick() {
      handler();
      setTimeout(() => {
         if (editor) {
            editor.removeBlocks(editor.document);
            editor.insertBlocks([{ content: '' }], editor.document[0], 'after');
         }
      }, 1);
   }

   return (
      <LuEraser
         className={`absolute rounded-full ${style} top-5 p-3 text-5xl text-primary-400 hover:text-primary-500 bg-primary  hover:bg-primary-100 dark:hover:bg-primary-200 border border-quaternary cursor-pointer transition-200`}
         onClick={handleClick}
      />
   );
}

export default ClearButton;
