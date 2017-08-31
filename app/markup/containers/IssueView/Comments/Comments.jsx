import React from 'react';
import { projectAvatar } from 'data/svg';
import Flex from '../../../../components/Base/Flex/Flex';

import {
  ActivitySection,
  AddCommentInput,

  Mention,
  OptionsButton,
  Dots,

  Commentd,
  CommentDate,
  CommentBody,
  CommentAvatar,
  CommentAuthor,
  YourComment,
} from './styled';

export default () => (
  <ActivitySection>
    <Flex column style={{ maxHeight: 488 }}>
      {[1, 2, 3, 4, 5].map(() => (
        <Commentd>
          <Flex row alignCenter spaceBetween style={{ marginBottom: 5 }}>
            <Flex row alignCenter>
              <CommentAvatar src={projectAvatar} alt="" />
              <Flex row>
                <CommentAuthor>
                  Jim Bunnings
                </CommentAuthor>
                <CommentDate>
                  30, August 2016
                </CommentDate>
              </Flex>
            </Flex>
            <OptionsButton>
              <Dots>...</Dots>
            </OptionsButton>
          </Flex>
          <Flex column>
            <CommentBody>
              {"You've mentioned the reasons for changing the name. But what were the reasons for holding onto the old name so long? I remember "}
              <Mention>@Jesse Byler</Mention>
              {' suggesting the name change back in January in: Re: Y U NO use Confluence'}
            </CommentBody>
          </Flex>
        </Commentd>
      ))}
      <Commentd>
        <Flex row alignCenter style={{ marginBottom: 5 }}>
          <CommentAvatar src={projectAvatar} alt="" />
          <YourComment>
            Comment
          </YourComment>
        </Flex>
        <AddCommentInput
          type="text"
          placeholder="Type your comment here"
        />
      </Commentd>
    </Flex>
  </ActivitySection>
);
