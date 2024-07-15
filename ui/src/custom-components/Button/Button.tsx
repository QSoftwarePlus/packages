import React from 'react';
import styled from 'styled-components';

const StyledButton = styled.button`
  background: #007bff;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  cursor: pointer;

  &:hover {
    background: #0056b3;
  }
`;

export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ children, onClick }) => (
  <StyledButton onClick={onClick}>{children}</StyledButton>
);

export default Button;
