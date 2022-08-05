import { LinkMetdata } from "@lukso/lsp-factory.js";
import { useState } from "react";
import { Box, Button, Heading, Table } from "react-bulma-components";

import ProfileModalLink from "./ProfileModalLink";

interface ProfileModalLinksProps {
  links: LinkMetdata[];
  onChange: (links: LinkMetdata[]) => void;
}

function ProfileModalLinks({ links, onChange }: ProfileModalLinksProps) {
  const [updating, setUpdating] = useState(-1);
  const [adding, setAdding] = useState(links.length === 0);

  const toggleAdding = () => {
    setAdding(state => ! state);
  };

  return (
    <Box>
      <Heading size={6}>Links</Heading>

      <Table size="fullwidth">
        <thead>
          <tr>
            <th>Title</th>
            <th>URL</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          { links.map((link, index) => {
            const onUpdate = () => {
              setUpdating(index);              
            };

            const onDelete = () => {
              if (! window.confirm('Are you sure you want to delete this link?')) {
                return;
              }

              const newLinks = [...links];
              newLinks.splice(index, 1);
              onChange(newLinks);
            };
            
            if (updating === index) {
              return (
                <ProfileModalLink
                  metadata={link}
                  onSuccess={(metadata) => {
                    const newLinks = [...links];
                    newLinks[index] = metadata;
                    onChange(newLinks);
                    setUpdating(-1);
                  }}
                  onCancel={() => {
                    setUpdating(-1);
                  }}
                />
              );
            }

            return (
              <tr key={index}>
                <td>{ link.title }</td>
                <td>
                  <a href={link.url} target="_blank" rel="noreferrer">{ link.url }</a>
                </td>
                <td>
                  <Button.Group size="small">
                    <Button color="info" onClick={onUpdate}>Update</Button>
                    <Button color="danger" onClick={onDelete}>Delete</Button>
                  </Button.Group>
                </td>
              </tr>
            );
          })}

          { adding && (
            <ProfileModalLink
              onSuccess={(metadata) => {
                const newLinks = [...links];
                newLinks.push(metadata);
                onChange(newLinks);
                toggleAdding();
              }}
              onCancel={toggleAdding}
            />
          )}

        </tbody>
      </Table>

      { ! adding && (
        <div style={{ textAlign: 'right' }}>
          <Button size="small" color="primary" onClick={toggleAdding}>Add</Button>
        </div>
      )}

    </Box>
  );
}

export default ProfileModalLinks;
