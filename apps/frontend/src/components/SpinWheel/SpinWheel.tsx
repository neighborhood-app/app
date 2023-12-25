import { Spinner } from "react-bootstrap";

export default function SpinWheel({ className }: {className?: string}) {
  return (
    <Spinner className={className} animation="border" role="status">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  );
}