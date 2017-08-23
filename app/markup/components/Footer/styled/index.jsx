import styled from 'styled-components';

// background-color: ${props => props.theme.primary};
export const Footer = styled.footer`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 70px;
  min-height: 70px;
  padding: 0px 20px;
  color: white;
  background-image: linear-gradient(to bottom, #4778c1 0%, #0052CC 99%, #0052CC 100%);
`;

export const StatsLabel = styled.span`
  color: rgba(255, 255, 255, .9);
  font-weight: 100;
  margin-right: 2px;
`;

export const StatsValue = styled.span`
`;

export const Separator = styled.div`
  height: 50px;
  width: 1px;
  background-color: white;
`;

export const WorkDiaryLink = styled.span`
  cursor: pointer;
  display: inline-block;
  position: relative;
  padding-bottom: 3px;
  :after {
    content: '';
    display: block;
    margin: auto;
    height: 2px;
    width: 0px;
    background: transparent;
    transition: width .5s ease, background-color .5s ease;
  }
  :hover:after {
    width: 100%;
    background: white;
  }
`;
