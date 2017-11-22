import styled from 'styled-components';

export const StatisticsItem = styled.div`
  min-width: 125px;
  height: 60px;
  display: flex;
  align-items: flex-start;
  padding: 8px;
  border-radius: 3px;
  ${props => (props.bgTheme === 'orange' ? `
    background-color: #FFAB00;
    .MetaItemName {
      color: #42526E !important;
    }
    .MetaItemValue {
      color: #091E42 !important;
    }
  ` : `
    background-color: white;
    .MetaItemName {
      color: #0052CC !important;
    }
    .MetaItemValue {
      color: #0052CC !important;
    }
  `)}
`;
