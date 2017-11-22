// @flow
import React from 'react';
import type { StatelessFunctionalComponent, Node } from 'react';
import AttachmentIcon from '@atlaskit/icon/glyph/attachment';
import UploadIcon from '@atlaskit/icon/glyph/upload';
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
  SectionHeader,
  MetaContainer,
} from './styled';

const IssueAttachments: StatelessFunctionalComponent<{}> = (): Node => (
  <Flex column>
    <SectionHeader>
      <H400>Attachments</H400>
    </SectionHeader>

    <AttachmentsContainer>
      <Flex row alignCenter>
        <UploadIcon size="medium" label="Upload" />
        <span style={{ marginLeft: 3 }}>
          Drop files to attach, or <a>browse</a>.
        </span>
      </Flex>
      <AttachmentsList>
        {[1, 2, 3, 4, 5].map(i => (
          <AttachmentItem key={i}>
            <FileContainer>
              <AttachmentIcon label="Attachment" primaryColor="#e9e9e9" size="xlarge" />
            </FileContainer>
            <MetaContainer>
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
            </MetaContainer>
          </AttachmentItem>
        ))}
      </AttachmentsList>
    </AttachmentsContainer>
  </Flex>
);

IssueAttachments.propTypes = {

};

export default IssueAttachments;
