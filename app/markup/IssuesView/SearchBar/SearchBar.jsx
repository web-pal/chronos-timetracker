import React from 'react';

import { refresh, filter, search } from 'data/svg';
import Flex from '../../../components/Base/Flex/Flex';
// import Flex from '@components/Base/Flex/Flex';
import {
  SearchBar,
  SearchIcon,
  SearchInput,
  SearchOptions,
  RefreshIcon,
  FilterIcon,
} from './styled';

export default () => (
  <SearchBar>
    <SearchIcon src={search} alt="" />
    <SearchInput placeholder="Search issue" />
    <SearchOptions>
      <RefreshIcon src={refresh} alt="" />
      <FilterIcon src={filter} alt="" />
    </SearchOptions>
  </SearchBar>
);
