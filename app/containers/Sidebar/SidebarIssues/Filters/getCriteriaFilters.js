// @flow
import type {
  IssueType,
  IssueStatus,
  CriteriaFilters,
} from '../../../../types';

type Props = {
  issueTypes: Array<IssueType>,
  issueStatuses: Array<IssueStatus>,
  selfKey: string,
};

export default function getCriteriaFilters({
  issueTypes,
  issueStatuses,
  selfKey,
}: Props): CriteriaFilters {
  const criteriaFilters: CriteriaFilters = [
    {
      name: 'Type',
      key: 'type',
      options: [...issueTypes],
      showIcons: true,
    },
    {
      name: 'Status',
      key: 'status',
      options: [...issueStatuses],
      showIcons: false,
    },
    {
      name: 'Assignee',
      key: 'assignee',
      options: [
        { name: 'Current User', id: selfKey },
        { name: 'Unassigned', id: 'unassigned' },
      ],
      showIcons: false,
    },
  ];

  return criteriaFilters;
}
