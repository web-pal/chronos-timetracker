import styled from 'styled-components';
import {
  Flex,
} from 'components';


export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  height: 94vh;
  width: 100%;
  min-width: 500px;
  padding: 3vh 0;

  background-image: linear-gradient(to top, #2965bf 0%, #0052CC 99%, #0052CC 100%);
`;

export const SpinnerContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: white;
  z-index: 20;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ContentOuter = styled.div`
  display: flex;
  flex-direction: row;
  background-color: white;
  width: 380px;
  overflow: hidden;
  border-radius: 5px;
  box-shadow: 0 4px 8px 0 rgba(9, 30, 66, 0.25);
  position: relative;
  height: 470px;
`;

export const ContentInner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: calc(100% - 80px);
  padding: 40px;
  width: 300px;
  min-width: 300px;
  position: absolute;
  left: ${(props) => {
    if (props.isActiveStep) return 0;
    if (props.step === 0) return -760;
    if (props.step === 1) return -380;
    if (props.step === 2) return 380;
    return 0;
  }}px;
  transition: left 0.3s ease-in-out;
  background-color: white;
`;

export const Logo = styled.img`
  height: 20%;
`;

export const Hint = styled.span`
  color: #DEEBFF;
  font-size: 14px;
  border-bottom: 1px solid rgba(0, 0, 0, 0);
  &:hover {
    opacity: 1;
    border-bottom: 1px solid rgba(255, 255, 225, 0.7);
    cursor: pointer;
  }
`;


const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 45px;
  min-height: 45px;

  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0;

  border-radius: 5px;
  cursor: pointer;
`;

export const PrimaryButton = styled(Button)`
  background-color: #0052CC;
  color: #FFFFFF;
  border: 0;
  :hover {
    background-color: hsla(216, 100%, 50%, 1);
  }
`;

export const DefaultButton = styled(Button)`
  background-color: rgba(9, 30, 66, 0.04);
  color: rgba(0, 0, 0, .7);
  border: 0;
  :hover {
    background-color: rgba(9, 30, 66, 0.1);
  }
`;

export const OauthButton = styled(Button)`
  background-color: white;
  border: 1px solid rgba(0, 0, 0, .05);
  box-shadow: 1px 1px 5px 0 rgba(0, 0, 0, 0.2) !important;
  color: #505F79;
  :hover {
    background-color: rgba(9, 30, 66, 0.02) !important;
  }
`;

export const ContentSeparator = styled.span`
  margin: 24px 0;
  color: #97A0AF;
  font-size: 11px;
  line-height: 1;
  margin-top: 24px;
`;

export const LoginInfo = styled.span`
  font-size: 24px;
  font-weight: 500;
  line-height: 28px;
  letter-spacing: -.01em;
  color: #DEEBFF;
  margin-bottom: 4vh;
`;

export const Error = styled.span`
  color: #DE350B;
  margin-bottom: 15px;
  align-self: left;
  font-size: 12px;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

export const ContentIconContainer = styled.div`
  background: hsla(216, 75%, 93%, 1);
  border-radius: 50%;
  box-shadow: 0 4px 8px 0 rgba(9,30,66,0.25);
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px;
  margin-bottom: 20px;
`;

export const Lock = styled.img`
`;

export const Title = styled.span`
  color: #172B4D;
  font-weight: 500;
  font-size: 18px;
`;

export const Subtitle = styled.span`
  color: #8993A4;
  margin-top: 4px;
  margin-bottom: 24px;
`;

export const BackButtonContainer = styled.div`
  position: absolute;
  bottom: 8px;
  button {
    font-size: 12px !important;
  }
`;

export const ContentStep = styled(Flex).attrs({
  column: true,
  alignCenter: true,
})`
  width: 100%;
`;

export const Account = styled.div`
  display: flex;
  padding: 16px;
  cursor: pointer;
  border-radius: 5px;
  &:hover {
    background-color: rgba(9, 30, 66, 0.1);
  }
`;

export const WebViewContainer = styled.div`
  & > webview {
    width: 380px;
    height: 430px;
    overflow: hidden;
    opacity: ${props => (props.isComplete ? 1 : 0)};
    transition: 0.5s;
  }
`;
