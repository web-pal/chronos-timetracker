import React from 'react';
import spinner from 'images/spinner.svg';

import {
  SpinnerContainer,
  Spinner,
} from './styled';


const LoaderAttachmentPopup = () => (
  <SpinnerContainer>
    <Spinner
      src={spinner}
      alt="Loading..."
    />
  </SpinnerContainer>
);

export default LoaderAttachmentPopup;
