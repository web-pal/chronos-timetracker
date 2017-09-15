import styled from 'styled-components';

export const TrackingViewContainer = styled.div`
  position: absolute;
  top: 85px;

  display: flex;
  flex-direction: column;
  width: 100%;
  z-index: 10;

  // background: white;
  // background: hsla(216, 30%, 98%, 1);
  background: hsla(218, 34%, 90%, 1);
  height: calc(100vh - 85px);
  transition: height .2s ease-in;
  border-left: 1px solid rgba(0, 0, 0, 0.18);
  ${props => !props.isActive ? `
    height: 0px;
    overflow: hidden;
  ` : ''}
`;

export const StopButton = styled.img`
  height: 200px;
  margin-top: 50px;
  margin-bottom: 50px;
`;
export const EditSection = styled.div`
  display: flex;
  flex-direction: row;
  border-radius: 5px;
  box-shadow: 0 4px 8px 0 rgba(9, 30, 66, 0.25);
  background: white;
  margin: 20px;
  padding: 10px;
  justify-content: center;
`;
export const EditSectionTitle = styled.span`
`;
export const VerticalSeparator = styled.div`
  width: 2px;
  height: 100%;
  background: #e1e4e9;
  min-height: 90px;
  margin: 0px 20px;
`;
export const StatsItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;
export const WorklogsSection = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 5px;
  box-shadow: 0 4px 8px 0 rgba(9, 30, 66, 0.25);
  background: white;
  margin: 20px;
  padding: 10px;
`;
export const WorklogsSectionTitle = styled.span`
`;
export const LastScreenshot = styled.img`
  height: 150px;
  max-width: 50%;
`;
export const WorklogsInformation = styled.div`
  dispay: flex;
  flex-direction: column;
  align-items: center;
  width: 50%;
  justify-content: center;
  padding-left: 20px;
`;
