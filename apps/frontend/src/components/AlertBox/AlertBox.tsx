import { Alert } from 'react-bootstrap';

interface Params {
  variant?: 'light' | 'success' | 'danger';
  className?: string;
  dismissible?: boolean;
  text: string;
}

export default function AlertBox({
  text,
  variant = 'light',
  className,
  dismissible = true,
}: Params) {
  return (
    <Alert className={className} variant={variant} dismissible={dismissible}>
      {text}
    </Alert>
  );
}
