import styled from 'styled-components';

// eslint-disable-next-line import/prefer-default-export
export const Button = styled.button`
  align-items: baseline;
  -webkit-box-align: baseline;
  -ms-flex-align: baseline;
  -webkit-align-items: baseline;
  background: ${props => props.background || '#0052CC'};
  box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-shadow: ;
  border-radius: 3px;
  border-width: 0;
  width: auto;
  color: #FFFFFF !important;
  cursor: default;
  display: -webkit-box;
  display: -moz-box;
  display: -ms-inline-flexbox;
  display: -webkit-inline-flex;
  display: inline-flex;
  font-style: normal;
  font-size: inherit;
  height: 2.2857142857142856em;
  line-height: 2.2857142857142856em;
  margin: 0;
  outline: none !important;
  padding: 0 8px;
  pointer-events: auto;
  text-align: center;
  text-decoration: none;
  transition-duration: 0.1s, 0.15s;
  -webkit-transition-duration: 0.1s, 0.15s;
  transition: background 0.1s ease-out, box-shadow 0.15s cubic-bezier(0.47, 0.03, 0.49, 1.38);
  -webkit-transition: background 0.1s ease-out, box-shadow 0.15s cubic-bezier(0.47, 0.03, 0.49, 1.38);
  user-select: none;
  -ms-user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  vertical-align: middle;
  white-space: nowrap;

  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
`;
