import React from 'react';

import Issue from '../../../components/Issue/Issue';
import { IssuesList } from './styled';

export default () => (
  <IssuesList>
    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => <Issue selected={n == 1} key={n} />)}
  </IssuesList>
);
