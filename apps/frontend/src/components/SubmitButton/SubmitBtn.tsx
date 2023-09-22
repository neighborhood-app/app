import { Button } from "react-bootstrap";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
}

export default function SubmitBtn({ text, ...props }: ButtonProps) {
  return (
    <Button {...props} variant='primary'>{text}</Button>
  )
}