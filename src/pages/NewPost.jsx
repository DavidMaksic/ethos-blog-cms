import Creator from '../features/creator/Creator';
import Heading from '../ui/Heading';
import Row from '../ui/Row';

function NewPost() {
   return (
      <>
         <Row type="horizontal">
            <Heading type="h1">Create article</Heading>
         </Row>
         <Row>
            <Creator />
         </Row>
      </>
   );
}

export default NewPost;
