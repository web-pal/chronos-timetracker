import styled from 'styled-components';

export const TrackingViewContainer = styled.div`
  position: absolute;
  top: 85px;

  display: flex;
  flex-direction: column;
  width: 100%;
  z-index: 10;

  // background: white;
  background: hsla(216, 30%, 98%, 1);
  height: calc(100vh - 85px);
  transition: height .2s ease-in;
  border-left: 1px solid rgba(0, 0, 0, 0.18);
  ${props => props.isActive ? `
    height: 0px;
    overflow: hidden;
  ` : ''}
`;

export const StopButton = styled.img`
`;
export const EditSection = styled.div`
`;
export const EditSectionTitle = styled.span`
`;
export const VerticalSeparator = styled.div`
`;
export const StatsItem = styled.span`
`;
export const WorklogsSection = styled.div`
`;
export const WorklogsSectionTitle = styled.span`
`;
export const Button = styled.button`
`;
export const LastScreenshot = styled.img`
`;
