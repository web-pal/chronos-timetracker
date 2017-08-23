import styled from 'styled-components';

// export const Footer = styled.div`
// `;
// export const Footer = styled.div`
// `;
// export const Footer = styled.div`
// `;

export const Hint = styled.span`
  color: white;
  font-size: 10px;
  font-weight: 600;
  opacity: 0.8;
  font-family: system-ui;
  margin-top: 15px;
  border-bottom: 1px solid rgba(255, 255, 225, 0.3);
  &:hover {
    opacity: 1;
    border-bottom: 1px solid rgba(255, 255, 225, 0.7);
    cursor: pointer;
  }
`;

export const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 40px;
`;

export const Button = styled.button`
  width: 80%;
  height: 40px;
  font-family: system-ui;
  font-size: 14px;
  color: #FFFFFF;
  letter-spacing: 0;
  border-radius: 3px;
  box-shadow: 0 1px 5px 2px rgba(64,64,64,0.05);
`;

export const PrimaryButton = Button.extend`
  background: #0052CC;
  border: 1px solid rgba(255, 255, 255, 0.48);
  margin-bottom: 10px;
  font-weight: 600;
  :hover {
    background: #0065FF;
  }
`;

export const SecondaryButton = Button.extend`
  background: #30a1e4;
  border: 1px solid rgba(91,125,170,0.67);
  :hover {
    background: #4bbcff;
    border-width: 1px;
  }
`;

export const Form = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const FormGroup = styled.div`
  width: 80%;
`;

  // &.jira {
  //   margin-top: 12px;
  // }
  // &.lock {
  //   margin-top: 12px;
  //   margin-left: 11px;
  // }
export const FormIcon = styled.img`
  position: absolute;
  margin-top: 15px;
  margin-left: 10px;
`;

// &.password {
//   &::-webkit-input-placeholder {
//     letter-spacing: 1px;
//   }
// }
export const FormInput = styled.input`
  width: calc(~"100% - 40px");
  padding-left: 40px;
  background: rgba(23, 43, 77, 0.73);
  border: 2px solid white;
  box-shadow: 0 2px 5px 0 rgba(0,0,0,0.17);
  border-radius: 3px;
  font-size: 14px;
  color: rgba(255,255,255,0.99);
  letter-spacing: 0;
  height: 40px;
  margin-bottom: 10px;
  width: 100%;
  &::-webkit-input-placeholder {
    font-size: 12px;
    color: rgba(255,255,255,0.65);
  }
  &:focus {
    background: rgba(250,251,252,0.20);
    border-color: rgba(23, 43, 77, 0.73);
  }
  &:hover {
    border-color: rgba(23, 43, 77, 0.73);
  }
`;

export const Container = styled.div`
  background-image: linear-gradient(to bottom, rgba(0, 82, 204, 0.18) 0%, rgb(71, 120, 193) 99%, rgb(71, 120, 193) 100%);
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;

export const Logo = styled.img`
  width: 50%;
  height: 50%;
`;

