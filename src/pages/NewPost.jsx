import Creator from '../features/creator/Creator';
import Heading from '../ui/Heading';
import Row from '../ui/Row';

function NewPost() {
   return (
      <div className="flex flex-col gap-8 my-auto w-[84.5rem] xl:w-[73rem] self-center">
         <Row type="horizontal">
            <Heading type="h1">Create article</Heading>
         </Row>

         <Row>
            <Creator />
         </Row>
      </div>
   );
}

export default NewPost;
