import React from 'react';

import { PlaceholderContainer, Placeholder } from './styled';

const IssuePlaceholder = () => (
  <PlaceholderContainer>
    <div className="animated-background">
      <Placeholder type="issueRight" />
      <Placeholder type="issueBottom" />
      <Placeholder type="descriptionRight" />
      <Placeholder type="descriptionBottom" />
      <Placeholder type="descriptionRightSecond" />
      <Placeholder type="descriptionBottomSecond" />
      <Placeholder type="attributesRight" />
      <Placeholder type="attributesBottom" />
    </div>
  </PlaceholderContainer>
);

export default IssuePlaceholder;
