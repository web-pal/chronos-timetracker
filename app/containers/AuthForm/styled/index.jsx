import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  height: 100%;
  width: 100%;
  min-width: 500px;
  padding: 3% 0;

  background-image: linear-gradient(to top, #2965bf 0%, #0052CC 99%, #0052CC 100%);
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 300px;
  background-color: white;
  padding: 40px;
  border-radius: 5px;
  box-shadow: 0 4px 8px 0 rgba(9, 30, 66, 0.25);
  min-height: 385px;
`;

export const Logo = styled.img`
  height: 20%;
  margin-bottom: 5%;
`;

export const Hint = styled.span`
  color: white;
  font-size: 14px;
  border-bottom: 1px solid rgba(0, 0, 0, 0);
  margin-top: 5%;
  &:hover {
    opacity: 1;
    border-bottom: 1px solid rgba(255, 255, 225, 0.7);
    cursor: pointer;
  }
`;

export const Input = styled.input`
  width: calc(100% - 10px);
  height: 40px;
  min-height: 40px;
  padding-left: 10px;
  margin-bottom: 10px;

  background: white;
  border: 2px solid hsla(217, 20%, 80%, 1);
  border-radius: 3px;

  font-size: 14px;
  letter-spacing: 0;

  &::-webkit-input-placeholder {
    font-size: 14px;
  }
  &:focus {
    border-color: hsla(216, 49%, 43%, 1);
  }
  &:hover {
    border-color: hsla(216, 49%, 43%, 1);
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

export const PrimaryButton = Button.extend`
  background-color: #0052CC;
  color: #FFFFFF;
  border: 0;
  :hover {
    background-color: hsla(216, 100%, 50%, 1);
  }
`;

export const OauthButton = Button.extend`
  background-color: white;
  color: rgba(0, 0, 0, 0.64);
  border: 1px solid rgba(0, 0, 0, .2);
  box-shadow: 0 4px 8px 0 rgba(9,30,66,0.25);
  :hover {
    background-color: hsla(218, 20%, 95%, 1);
  }
`;

export const ContentSeparator = styled.span`
  margin: 25px 0px;
  color: rgba(0, 0, 0, .5);
  font-size: 12px;
`;

export const LoginInfo = styled.span`
  color: white;
  font-size: 24px;
  margin-bottom: 3%;
`;

export const Error = styled.span`
  color: #DE350B;
  margin-bottom: 30px;
  align-self: left;
  font-size: 12px;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;
