import styled from 'styled-components';

export const Hint = styled.span`
  color: white;
  font-size: 14px;
  border-bottom: 1px solid rgba(0, 0, 0, 0);
  margin-top: 100px;
  &:hover {
    opacity: 1;
    border-bottom: 1px solid rgba(255, 255, 225, 0.7);
    cursor: pointer;
  }
`;

export const Input = styled.input`
  width: calc(100% - 10px);
  background: white;
  border: 2px solid #5781bf;
  border-radius: 3px;
  font-size: 14px;
  letter-spacing: 0;
  height: 40px;
  padding-left: 10px;
  margin-bottom: 20px;
  &::-webkit-input-placeholder {
    font-size: 14px;
  }
  &:focus {
    border-color: #0052CC;
  }
  &:hover {
    border-color: #0052CC;
  }
`;

export const Button = styled.button`
  width: 100%;
  height: 45px;
  font-size: 14px;
  background-color: #0052CC;
  color: #FFFFFF;
  letter-spacing: 0;
  border-radius: 3px;
  border: 2px solid #0052CC;
  border-radius: 3px;
  font-weight: 600;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

export const OauthButton = Button.extend`
  color: rgba(0, 0, 0, 0.64);
  background-color: white;
  box-shadow: 0 4px 8px 0 rgba(9,30,66,0.25);
  border-color: rgba(0, 0, 0, .2);
  border-width: 1px;
`;


export const Form = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 300px;
  background-color: white;
  padding: 40px;
  border-radius: 5px;
  box-shadow: 0 4px 8px 0 rgba(9, 30, 66, 0.25);
`;

export const Container = styled.div`
  background-image: linear-gradient(to top, #2965bf 0%, #0052CC 99%, #0052CC 100%);
  height: 100%;
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 500px;
  align-items: center;
  padding: 40px 0px;
`;

export const Logo = styled.img`
  width: 30%;
  height: 30%;
  margin-bottom: 100px;
`;

