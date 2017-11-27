// @flow
import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import type { StatelessFunctionalComponent, Node } from 'react';
import { getComments, getCommentsFetching, getUserData, getSelectedIssue, getCommentsAdding } from 'selectors';
import { issuesActions } from 'actions';
import { Flex, IssueCommentPlaceholder } from 'components';
import ReactMarkdown from 'react-markdown';
import Spinner from '@atlaskit/spinner';
import Button from '@atlaskit/button';

import {
  ActivitySection,
  AddCommentInput,
  Actions,

  CommentInputContainer,
  CommentInput,
  Commentd,
  CommentDate,
  CommentBody,
  CommentAvatar,
  CommentAuthor,
  YourComment,
} from './styled';

import type {
  IssueComment,
  Issue,
  CommentRequest,
  User,
} from '../../../types';

type Props = {
  comments: Array<IssueComment>,
  fetching: boolean,
  adding: boolean,
  self: User,
  selectedIssue: Issue,
  commentRequest: CommentRequest,
};

const IssueComments: StatelessFunctionalComponent<Props> = ({
  comments,
  fetching,
  adding,
  self,
  selectedIssue,
  commentRequest,
}: Props): Node => (
  <ActivitySection>
    <Flex column>
      <Flex column>
        {fetching && [1, 2, 3, 4, 5, 6].map(i => <IssueCommentPlaceholder key={i} />)}
        {!fetching && comments.length === 0 &&
          <Flex row>
            There are no comments yet on this issue.
          </Flex>
        }
        {!fetching && comments.map(comment => (
          <Commentd key={comment.id}>
            <Flex row alignCenter spaceBetween style={{ marginBottom: 5 }}>
              <Flex row alignCenter>
                <CommentAvatar src={comment.author.avatarUrls['48x48']} alt="" />
                <Flex row>
                  <CommentAuthor>
                    {comment.author.displayName}
                  </CommentAuthor>
                  <CommentDate>
                    {moment(comment.updated).format('DD, MMMM YYYY')}
                  </CommentDate>
                </Flex>
              </Flex>
            </Flex>
            <Flex column>
              <CommentBody>
                <ReactMarkdown
                  softBreak="br"
                  source={comment.body}
                />
              </CommentBody>
            </Flex>
          </Commentd>
        ))}
      </Flex>
      {!fetching &&
        <CommentInput>
          <Flex row alignCenter style={{ marginBottom: 5 }}>
            <CommentAvatar src={self.avatarUrls['48x48']} alt="" />
            <YourComment>
              Comment
            </YourComment>
          </Flex>
          <CommentInputContainer>
            <AddCommentInput
              label=""
              type="text"
              placeholder="Type your comment here"
              shouldFitContainer
              id="comment-input"
            />
            <Actions>
              <Button
                onClick={() => {
                  const input = document.querySelector('#comment-input');
                  if (input) {
                    // $FlowFixMe
                    const { value } = input;
                    commentRequest(value, selectedIssue);
                  }
                }}
                iconAfter={adding ? <Spinner /> : null}
                isDisabled={adding}
              >
                Add
              </Button>
            </Actions>
          </CommentInputContainer>
        </CommentInput>
      }
    </Flex>
  </ActivitySection>
);

function mapStateToProps(state) {
  return {
    selectedIssue: getSelectedIssue(state),
    comments: getComments(state),
    fetching: getCommentsFetching(state),
    adding: getCommentsAdding(state),
    self: getUserData(state),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(issuesActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(IssueComments);
