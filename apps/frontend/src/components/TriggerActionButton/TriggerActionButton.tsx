import { FormEvent } from "react";
import { useSubmit } from "react-router-dom";
import { Form } from "react-bootstrap";
import styles from "./TriggerActionButton.module.css"
import CustomBtn from "../CustomBtn/CustomBtn";


/**
 * This is a custom button element that will trigger the action of the specified route. It's current use case
 * is to accept a Response offer or delete a Response.
 * @param id - id of the element for which the action is triggered (At the moment , just the Response ID)
 * @param route - url of the route that triggers the action
 * @param intent - decides which action to trigger based on the intent 
 * @param text - the text that shows in the button
 * @returns React component
 */

interface Props {
    id: number,
    route: string,
    intent: 'accept-offer' | 'delete-response',
    text: string
}
export default function TriggerActionButton(
    {
        id,
        route,
        intent,
        text
    }: Props
) {
    const submit = useSubmit();

    function handleResponseAction(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        submit(event.currentTarget, {
            method: 'post',
            action: route,
        });
    }

    return (
        <Form method='post' onSubmit={handleResponseAction}>
            <Form.Group>
                <Form.Control type='hidden' name='intent' value={intent} />
                <Form.Control type='hidden' name='responseId' value={id} />
            </Form.Group>
            <CustomBtn variant='primary' className={styles.btn} type='submit'>
                {text}
            </CustomBtn>
        </Form>
    )
}