import React from 'react';
import spinner from 'images/spinner.svg';
import * as S from './styled';


const LoaderAttachmentPopup = () => (
  <S.Spinner>
    <S.SpinnerDesc
      src={spinner}
      alt="Loading..."
    />
  </S.Spinner>
);

export default LoaderAttachmentPopup;
