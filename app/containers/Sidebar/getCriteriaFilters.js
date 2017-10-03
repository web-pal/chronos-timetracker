import { fromJS } from 'immutable';

const handleFilterOfFilters = (f, filterName) => ev => f(ev.target.value, filterName);

export default function getCriteriaFilters(props) {
  const {
    AllIssuesTypes, AllSubIssuesTypes, AllIssuesStatuses,
    issueFilterOfFiltersTypes, issueFilterOfFiltersStatus,
    setFilterOfIssuesFiltersValue,
    isStatusFilterActvie,
    isTypeFilterActvie,
    assigneeActiveFilters,
    showFilterCriteriaType,
    showFilterCriteriaStatus,
    showFilterCriteriaAssignee,
  } = props;

  const criteriaFilters = [
    {
      name: 'Type',
      criteriaKey: 'Type',
      options: [
        { key: 'Standard', header: 'Standard Issue Types', values: AllIssuesTypes },
        { key: 'Sub', header: 'Sub-Task Issue Types', values: AllSubIssuesTypes },
      ],
      isActive: isTypeFilterActvie,
      filterOfFilters: issueFilterOfFiltersTypes,
      isOpen: showFilterCriteriaType,
      showIcons: true,
      handleFilterOfFilters:
       handleFilterOfFilters(setFilterOfIssuesFiltersValue, 'Type'),
      hideFilterOfFiltersField: false,
    },
    {
      name: 'Status',
      criteriaKey: 'Status',
      options: [{ key: 'Status', values: AllIssuesStatuses }],
      isActive: isStatusFilterActvie,
      filterOfFilters: issueFilterOfFiltersStatus,
      isOpen: showFilterCriteriaStatus,
      showIcons: false,
      handleFilterOfFilters:
       handleFilterOfFilters(setFilterOfIssuesFiltersValue, 'Status'),
      hideFilterOfFiltersField: false,
    },
    {
      name: 'Assignee',
      criteriaKey: 'Assignee',
      options: [{
        key: 'Assignee',
        values: fromJS([
          { name: 'Unassigned', id: 'none', checked: assigneeActiveFilters.has('none') },
          {
            name: 'Current User',
            id: 'currentUser',
            checked: assigneeActiveFilters.has('currentUser'),
          },
        ]),
      }],
      isActive: !!assigneeActiveFilters.size,
      filterOfFilters: null,
      isOpen: showFilterCriteriaAssignee,
      showIcons: false,
      handleFilterOfFilters: null,
      hideFilterOfFiltersField: true,
    },
  ];

  return criteriaFilters;
}
