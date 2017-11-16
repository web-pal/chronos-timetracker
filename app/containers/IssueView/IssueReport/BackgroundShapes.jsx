import React from 'react';
import { BackgroundShape } from './styled';

export default () => (
  <div>
    <BackgroundShape number={1} color="#0962E8" opacity="1" />
    <BackgroundShape number={2} color="#0962E8" opacity="0.5" />
    <BackgroundShape number={3} color="#0962E8" opacity="0.25" />
    <BackgroundShape number={4} color="#0962E8" opacity="0.15" />
  </div>
);
