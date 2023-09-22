import { Button } from 'react-bootstrap';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {};

export default function SubmitBtn({...props }: ButtonProps) {
  return (
    <Button {...props} variant='primary'></Button>
  )
}