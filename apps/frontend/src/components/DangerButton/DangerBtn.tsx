import { Button } from 'react-bootstrap';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {};

export default function DangerBtn({ ...props }: ButtonProps) {
  return (
    <Button variant='danger' {...props}></Button>
  );
}