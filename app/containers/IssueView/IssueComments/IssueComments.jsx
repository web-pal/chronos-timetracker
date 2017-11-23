// @flow
import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import type { StatelessFunctionalComponent, Node } from 'react';
import { projectAvatar } from 'data/svg';
import { getComments, getCommentsFetching, getSelectedIssue, getCommentsAdding } from 'selectors';
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
} from '../../../types';

type Props = {
  comments: Array<IssueComment>,
  fetching: boolean,
  adding: boolean,
  selectedIssue: Issue,
  commentRequest: CommentRequest,
};

const IssueComments: StatelessFunctionalComponent<Props> = ({
  comments,
  fetching,
  adding,
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
                <CommentAvatar src={projectAvatar} alt="" />
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
            <CommentAvatar src={projectAvatar} alt="" />
            <YourComment>
              Comment
            </YourComment>
          </Flex>
          <CommentInputContainer>
            <AddCommentInput
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
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(issuesActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(IssueComments);
