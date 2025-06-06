import styled from 'styled-components';
import { colors } from '../../assets/styles/colors';

const BaseButton = styled.button`
  background-color: ${colors.yellowOrange.golden};
  color: ${colors.neutral.white};
  border: none;
  //border-radius: 8px;
  border-radius: 0.5rem;
  //padding: 10px 15px;
  padding: 0.625rem 0.9375rem;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${colors.yellowOrange.lightOrange};
  }

  &:disabled {
    background-color: ${colors.neutral.lightGray};
    cursor: not-allowed;
  }
`;

export default BaseButton;
