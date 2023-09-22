import { Button } from "react-bootstrap";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {};

export default function LinkBtn({ ...props }: ButtonProps) {
  return (
    <Button variant='outline-dark' {...props}></Button>
  );
}