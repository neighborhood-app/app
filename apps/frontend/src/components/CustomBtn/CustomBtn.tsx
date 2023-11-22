import { Button } from 'react-bootstrap';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: 'primary' | 'outline-dark' | 'danger';
  size?: 'sm' | 'lg';
}

/**
 * @param variant - one of 'primary', 'outline-dark' or 'danger'
 * @param - any other valid Button attributes
 * @returns a styled Button component according to the variant attribute
 */
export default function CustomBtn({ ...props }: ButtonProps) {
  return <Button {...props}></Button>;
}
