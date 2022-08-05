import { LinkMetdata } from "@lukso/lsp-factory.js";
import { useState } from "react";
import { Button, Form } from "react-bulma-components";

interface ProfileModalLinkProps {
  metadata?: LinkMetdata;
  onSuccess: (metadata: LinkMetdata) => void;
  onCancel: () => void;
}

function ProfileModalLink({ metadata, onSuccess, onCancel }: ProfileModalLinkProps) {
  const [title, setTitle] = useState(metadata ? metadata.title : '');
  const [url, setUrl] = useState(metadata ? metadata.url : '');

  const onSubmit = () => {
    onSuccess({ title, url });
  };

  return (
    <tr>
      <td>
        <Form.Input
          placeholder="Title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}  
        />
      </td>
      <td>
        <Form.Input
          placeholder="URL"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
          }}  
        />
      </td>
      <td>
        <Button.Group size="small">
          <Button color="primary" onClick={onSubmit}>{ metadata ? 'Update' : 'Add' }</Button>
          <Button color="danger" onClick={onCancel}>Cancel</Button>
        </Button.Group>
      </td>
    </tr>
  );
}

export default ProfileModalLink;
