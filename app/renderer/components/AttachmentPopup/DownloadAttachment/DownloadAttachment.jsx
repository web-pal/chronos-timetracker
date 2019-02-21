import React from 'react';
import fileImages from 'images/file.png';
import * as S from './styled';

const DownloadAttachment = ({ attachment }) => (
  <S.DownloadMain>
    <S.DownloadLink
      href={attachment.content}
      download={attachment.filename}
    >
      <S.FileImage
        src={fileImages}
        alt="fileImages"
      />
    </S.DownloadLink>
  </S.DownloadMain>
);

export default DownloadAttachment;
