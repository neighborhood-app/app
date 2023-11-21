import { FormEvent } from 'react';
import { useSubmit } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import CustomBtn from '../CustomBtn/CustomBtn';
import { SingleRequestFormIntent } from '../../types';

/**
 * This is a custom button element that will trigger the action of the specified route.
 * @param id (optional) - id of the element for which the action is triggered (At the moment, just the Response ID)
 * @param route - url of the route that triggers the action
 * @param intent - decides which action to trigger based on the intent
 * @param text - the text that shows in the button
 * @param variant (optional) - the variant of the rendered button ('primary' | 'outline-dark' | 'danger')
 * @returns React component
 */

interface Props {
  id?: number | null;
  route: string;
  intent:
    | 'accept-offer'
    | 'delete-response'
    | 'leave-neighborhood'
    | 'join-neighborhood'
    | SingleRequestFormIntent;
  text: string | JSX.Element;
  idInputName?: string;
  variant?: 'primary' | 'outline-dark' | 'danger';
  className?: string;
  size?: 'sm' | 'lg';
}

export default function TriggerActionButton({
  id = null,
  route,
  intent,
  text,
  idInputName,
  variant = 'primary',
  className,
  size,
}: Props) {
  const submit = useSubmit();

  function handleAction(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    submit(event.currentTarget, {
      method: 'post',
      action: route,
    });
  }

  return (
    <Form method="post" onSubmit={handleAction}>
      <Form.Group>
        <Form.Control type="hidden" name="intent" value={intent} />
        {id ? <Form.Control type="hidden" name={idInputName} value={id} /> : null}
      </Form.Group>
      <CustomBtn className={className} variant={variant} size={size} type="submit">
        {text}
      </CustomBtn>
    </Form>
  );
}
