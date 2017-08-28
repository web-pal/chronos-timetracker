import React from 'react';

import { taskType, majorPriority } from 'data/svg';
import Flex from '../../../components/Base/Flex/Flex';
import NavBar from '../../components/NavBar/NavBar';
import {
  Filters,
  FilterItem,
  FilterTitle,
  FilterOptions,
  Option,
  RadioButton,
  FilterItems,
  OptionImage,
  StatusOptionLabel,

  CRBContainer,
  CRBInput,
  CRBRadioCheckedOuter,
  CRBRadioCheckedInner,
  CRBRadioUnchecked,
  RadioContainer,
  OptionLabel,
  // TextOption,
  // TypeOption,
  // StatusOption,
  // CheckboxOption,
  // RadioOption,
} from './styled';


// eslint-disable-next-line
const CustomRadioButton = ({ checked, name }) => (
  <CRBContainer>
    <CRBInput
      type="radio"
      name={name}
    />
    {checked ?
      <CRBRadioCheckedOuter>
        <CRBRadioCheckedInner />
      </CRBRadioCheckedOuter>
      : <CRBRadioUnchecked />
    }
  </CRBContainer>
);

// eslint-disable-next-line
const RadioOption = ({ label, checked, name, img, status }) => (
  <RadioContainer>
    <CustomRadioButton
      checked={checked}
      name={name}
    />

    {img &&
      <OptionImage src={img} alt="" />
    }

    {status ?
      <StatusOptionLabel
        htmlFor={name}
        color={status.color}
        bgColor={status.bgColor}
      >
        {label}
      </StatusOptionLabel> :
      <OptionLabel htmlFor={name}>
        {label}
      </OptionLabel>
    }
  </RadioContainer>
);

// eslint-disable-next-line
const RadioFilterItem = ({ name, title, options }) => (
  <FilterItem>
    <FilterTitle>
      {title}
    </FilterTitle>
    <FilterOptions>
      {options.map(o => (
        <RadioOption
          img={o.img}
          label={o.label}
          name={name}
          status={o.status}
        />
      ))}
    </FilterOptions>
  </FilterItem>
);

const statusOptions = [
  { label: 'TO DO', value: 'TO DO', status: { color: 'white', bgColor: '#365172' } },
  { label: 'BACKLOG', value: 'BACKLOG', status: { color: 'white', bgColor: '#3F5C7C' } },
  { label: 'DONE', value: 'DONE', status: { color: 'white', bgColor: '#00801B' } },
  { label: 'READY TO DEPLOY', value: 'READY TO DEPLOY', status: { color: '#503C00', bgColor: '#FFCF28' } },
];

const typeOptions = [
  { label: 'Improvement', value: 'Improvement', img: taskType },
  { label: 'Lead', value: 'Lead', img: taskType },
  { label: 'Bug', value: 'Bug', img: taskType },
  { label: 'Task', value: 'Task', img: taskType },
  { label: 'Epic', value: 'Epic', img: taskType },
  { label: 'Support', value: 'Support', img: taskType },
  { label: 'Purchase', value: 'Purchase', img: taskType },
  { label: 'New Feature', value: 'New Feature', img: taskType },
  { label: 'Fault', value: 'Fault', img: taskType },
  { label: 'Test', value: 'Test', img: taskType },
  { label: 'IT Help', value: 'IT Help', img: taskType },
  { label: 'Story', value: 'Story', img: taskType },
  { label: 'Access', value: 'Access', img: taskType },
  { label: 'Sub-Task', value: 'Sub-Task', img: taskType },
];

const projectOptions = [
  { label: 'DBGlass', value: 'DBGlass' },
  { label: 'Chronos', value: 'Chronos' },
  { label: 'Hostaway', value: 'Hostaway' },
  { label: 'DeliverMD', value: 'DeliverMD' },
  { label: 'GreenCure', value: 'GreenCure' },
  { label: 'React Trello Boards', value: 'RTB' },
  { label: 'Bitfit', value: 'Bitfit' },
  { label: 'Hypefactors', value: 'Hypefactors' },
];

const assigneeOptions = [
  { label: 'All', value: 'all' },
  { label: 'Me', value: 'me' },
];

const sortOptions = [
  { label: 'Proprity', value: 'all' },
  { label: 'Date', value: 'me' },
  { label: 'Name', value: 'me' },
];

const priorityOptions = [
  { label: 'Major', value: 'a', img: majorPriority },
  { label: 'Middle', value: 'b', img: majorPriority },
  { label: 'Minor', value: 'c', img: majorPriority },
];

export default () => (
  <Filters>
    <NavBar title="Filters" />
    <FilterItems>
      <RadioFilterItem
        title="Sort By"
        name="sortby"
        options={sortOptions}
      />
      <RadioFilterItem
        title="Assignee"
        name="assignee"
        options={assigneeOptions}
      />
      <RadioFilterItem
        title="Project"
        name="projects"
        options={projectOptions}
      />
      <RadioFilterItem
        title="Board"
        name="boards"
        options={projectOptions}
      />
      <RadioFilterItem
        title="Type"
        name="types"
        options={typeOptions}
      />
      <RadioFilterItem
        title="Status"
        name="status"
        options={statusOptions}
      />
      <RadioFilterItem
        title="Priority"
        name="priority"
        options={priorityOptions}
      />
    </FilterItems>
  </Filters>
);
