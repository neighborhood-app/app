import { FormEvent } from 'react';
import { useSubmit } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import CustomBtn from '../CustomBtn/CustomBtn';

/**
 * This is a custom button element that will trigger the action of the specified route. It's current use case
 * is to accept a Response offer or delete a Response.
 * @param id - id of the element for which the action is triggered (At the moment , just the Response ID)
 * @param route - url of the route that triggers the action
 * @param intent - decides which action to trigger based on the intent
 * @param text - the text that shows in the button
 * @param variant (optional) - the variant of the rendered button ('primary' | 'outline-dark' | 'danger')
 * @returns React component
 */

interface Props {
  id?: number | null;
  route: string;
  intent: 'accept-offer' | 'delete-response' | 'leave-neighborhood';
  text: string;
  variant?: 'primary' | 'outline-dark' | 'danger';
  className?: string;
}

export default function TriggerActionButton({
  id = null,
  route,
  intent,
  text,
  variant = 'primary',
}: Props) {
  const submit = useSubmit();

  function handleResponseAction(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    submit(event.currentTarget, {
      method: 'post',
      action: route,
    });
  }

  return (
    <Form method="post" onSubmit={handleResponseAction}>
      <Form.Group>
        <Form.Control type="hidden" name="intent" value={intent} />
        {id ? <Form.Control type="hidden" name="responseId" value={id} /> : null} 
      </Form.Group>
      <CustomBtn variant={variant} type="submit">
        {text}
      </CustomBtn>
    </Form>
  );
}
