import { Button } from 'react-bootstrap';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: "primary" | "outline-dark" | "danger";
};

export default function CustomBtn({ ...props }: ButtonProps) {
  return (
    <Button {...props}></Button>
  );
}