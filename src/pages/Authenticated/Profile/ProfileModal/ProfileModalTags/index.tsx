import { Fragment, useState } from "react";
import { Box, Button, Form, Heading, Tag } from "react-bulma-components";

interface ProfileModalTagsProps {
  tags: string[];
  onChange: (tags: string[]) => void;
}

function ProfileModalTags({ tags, onChange }: ProfileModalTagsProps) {
  const [tag, setTag] = useState('');

  const canAddTag = /^[A-Za-z0-9]+$/.test(tag) && ! tags.includes(tag);
  const onAddTag = () => {
    const newTags = [...tags];
    newTags.push(tag);
    onChange(newTags);
    setTag('');
  };

  return (
    <Box>
      <Heading size={5}>Tags</Heading>
      { tags.length === 0 ? 'No tags added.' : null }
      { tags.length > 0 ? (
        <Tag.Group hasAddons>
          { tags.map((tag, index) => {
            const onRemove = () => {
              const newTags = [...tags];
              newTags.splice(index, 1);
              onChange(newTags);
            };

            return (
              <Fragment key={tag}>
                <Tag key={tag}>{ tag }</Tag>
                <Tag remove onClick={onRemove} />
              </Fragment>
            );
          })}
        </Tag.Group>
      ) : null }
      <Form.Field>
        <Form.Label>
          New Tag
        </Form.Label>
        <Form.Control>
          <Form.Input
            placeholder="e.g web3"
            type="text"
            value={tag}
            pattern="^[A-Za-z0-9]$/"
            onChange={(e) => {
              setTag(e.target.value);
            }}
          />
        </Form.Control>
        <div style={{ textAlign: 'right', marginTop: 3 }}>
          <Button size="small" disabled={! canAddTag} onClick={onAddTag}>
            Add
          </Button>
        </div>
      </Form.Field>
    </Box>
  );
}

export default ProfileModalTags;
