// @flow
import React from 'react';
import type { StatelessFunctionalComponent, Node } from 'react';
import AttachmentIcon from '@atlaskit/icon/glyph/attachment';
import DownloadIcon from '@atlaskit/icon/glyph/download';
// import DocumentFilledIcon from '@atlaskit/icon/glyph/document-filled';
// import DocumentIcon from '@atlaskit/icon/glyph/document';
import { Flex } from 'components';
import { H400 } from 'styles/typography';

import {
  AttachmentsContainer,
  AttachmentItem,
  AttachmentsList,
  FileContainer,
  FileName,
  FileSize,
  FileUploadDate,
} from './styled';

const IssueAttachments: StatelessFunctionalComponent<{}> = (): Node => (
  <Flex column>
    <div
      style={{
        borderTop: '2px solid rgba(0, 0, 0, .1)',
        marginTop: 10,
        paddingTop: 10,
        marginBottom: 10,
      }}
    >
      <H400>Attachments</H400>
    </div>

    <AttachmentsContainer>
      <Flex row alignCenter style={{ marginBottom: 10 }}>
        {/* TODO: replace download icon with upload icon */}
        <DownloadIcon size="medium" label="Upload" />
        <span style={{ marginLeft: 3 }}>
          Drop files to attach, or <a>browse</a>.
        </span>
      </Flex>
      <AttachmentsList>
        {[1, 2, 3, 4, 5].map(() => (
          <AttachmentItem>
            <FileContainer>
              <AttachmentIcon label="Attachment" primaryColor="#e9e9e9" size="xlarge" />
            </FileContainer>
            <Flex column style={{ width: 180, margin: '5px 10px' }}>
              <FileName>
                filter.svg
              </FileName>
              <Flex row spaceBetween>
                <FileUploadDate>
                  1 hour ago
                </FileUploadDate>
                <FileSize>
                  1 kB
                </FileSize>
              </Flex>
            </Flex>
          </AttachmentItem>
        ))}
      </AttachmentsList>
    </AttachmentsContainer>
  </Flex>
);

IssueAttachments.propTypes = {

};

export default IssueAttachments;
