import React from 'react';

import fileImages from 'images/file.png';

import {
  FileImage,
  DownloadLink,
  DownloadMainContainer,
} from './styled';

const DownloadAttachment = ({ attachment }) => (
  <DownloadMainContainer>
    <DownloadLink
      href={attachment.content}
      download={attachment.filename}
    >
      <FileImage
        src={fileImages}
        alt="fileImages"
      />
    </DownloadLink>
  </DownloadMainContainer>
);

export default DownloadAttachment;
