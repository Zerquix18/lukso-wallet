import { Fragment, useRef, useState } from "react";
import { Card, Heading, Media, Progress, Image, Content, Button, Tag } from "react-bulma-components";
import { useQuery } from "@tanstack/react-query";

import ERC725, { ERC725JSONSchema } from "@erc725/erc725.js";
import LSP3UniversalProfileMetadata from '@erc725/erc725.js/schemas/LSP3UniversalProfileMetadata.json';
import { LSP3ProfileJSON } from '@lukso/lsp-factory.js';

import { useAuthenticatedUser } from "../../../hooks";
import { DEFAULT_CONFIG, DEFAULT_PROVIDER } from "../../../constants";
import ProfileModal from "./ProfileModal";

const DEFAULT_BACKGROUND_IMAGE = 'http://bulma.io/images/placeholders/1280x960.png';
const DEFAULT_PROFILE_IMAGE = 'http://bulma.io/images/placeholders/128x128.png';

function Profile() {
  const { address } = useAuthenticatedUser();
  const [editing, setEditing] = useState(false);

  const erc725Ref = useRef(
    new ERC725(LSP3UniversalProfileMetadata as ERC725JSONSchema[], address, DEFAULT_PROVIDER, DEFAULT_CONFIG)
  );
  const erc725 = erc725Ref.current;

  const toggleEditing = () => {
    setEditing(state => ! state);
  };

  const fetchProfileData = async () => {
    const data = await erc725.fetchData('LSP3Profile');
    const value = data.value as any as LSP3ProfileJSON;
    return value.LSP3Profile;
  };

  const { isLoading, data: profile } = useQuery(['profile'], fetchProfileData);

  if (isLoading || ! profile) {
    return <Progress />;
  }

  let backgroundImage = DEFAULT_BACKGROUND_IMAGE;
  let profileImage = DEFAULT_PROFILE_IMAGE;

  if (profile.backgroundImage && profile.backgroundImage.length > 0) {
    backgroundImage = 'https://ipfs.io/ipfs/' + profile.backgroundImage[0].url.replace('ipfs://', '');
  }

  if (profile.profileImage && profile.profileImage.length > 0) {
    profileImage = 'https://ipfs.io/ipfs/' + profile.profileImage[0].url.replace('ipfs://', '');
  }

  const tags = profile.tags || [];
  const links = profile.links || [];

  return (
    <Card style={{ width: 300, margin: 'auto' }}>
      <Card.Image size="4by3" src={backgroundImage} />
      <Card.Content>
        <Media>
          <Media.Item renderAs="figure" align="left">
            <Image size={64} alt="64x64" src={profileImage} />
          </Media.Item>
          <Media.Item>
            <Heading size={4}>{ profile.name || 'Unnamed' }</Heading>
            <Heading subtitle size={6}>
              { tags.length > 0 && (
                <Tag.Group hasAddons>
                  { tags.map((tag) => {
                    return (
                      <Fragment key={tag}>
                        <Tag key={tag}>{ tag }</Tag>
                      </Fragment>
                    );
                  })}
                </Tag.Group>
              )}
            </Heading>
          </Media.Item>
        </Media>
        <Content>
          { profile.description }
          { links.length > 0 && (
            <ul>
              { links.map((link, index) => {
                return (
                  <li key={index}>
                    <a href={'//' + link.url}>{ link.title }</a>
                  </li>
                );
              })}
            </ul>
          )}
        </Content>
      </Card.Content>
      <Card.Footer>
        <Card.Footer.Item>
          <Button color="white" onClick={toggleEditing}>Change profile</Button>
        </Card.Footer.Item>
      </Card.Footer>

      { editing && (
        <ProfileModal
          profile={profile}
          onClose={toggleEditing}
        />
      )}
    </Card>
  );
}

function ProfileWrapper() {
  return (
    <div>
      <Heading>
        My Profile
      </Heading>

      <Profile />
    </div>
  );
}

export default ProfileWrapper;
