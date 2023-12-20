import { Modal, Form, Container, Row, Col, InputGroup } from 'react-bootstrap';
import { useParams, useSubmit } from 'react-router-dom';
import { FormEvent, useState, useRef } from 'react';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import { SearchResult } from 'leaflet-geosearch/dist/providers/provider';
import styles from './EditNeighborhoodModal.module.css';
import CustomBtn from '../CustomBtn/CustomBtn';

const provider = new OpenStreetMapProvider();

interface Props {
  show: boolean;
  handleClose: () => void;
  name: string;
  description: string;
  location: SearchResult | null;
}

export default function EditNeighborhoodModal({
  show,
  handleClose,
  name,
  description,
  location = null,
}: Props) {
  const validInputPattern = /\s*(\S\s*){4,}/;
  const [formSubmitted, setFormSubmitted] = useState(false);

  const locationsRef = useRef<SearchResult[] | null>();

  const [nameInput, setNameInput] = useState(name);
  const [textAreaInput, setTextAreaInput] = useState(description);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [locationInput, setLocationInput] = useState(location);
  const [isLoading, setIsLoading] = useState(false);
  const { id: neighborhoodId } = useParams();
  const submit = useSubmit();
  const closeModal = () => {
    handleClose();
    setNameInput(name);
    setTextAreaInput(description);
  };

  function validateInput() {
    return validInputPattern.test(nameInput);
  }

  function isValidLocation(location: {} | null | undefined): location is SearchResult {
    return (
      location !== null &&
      location !== undefined &&
      Object.hasOwn(location, 'x') &&
      Object.hasOwn(location, 'y') &&
      Object.hasOwn(location, 'label') &&
      Object.hasOwn(location, 'bounds')
    );
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    const form = event.currentTarget;
    setFormSubmitted(true);

    if (!form.checkValidity() || !validateInput() || !isValidLocation(locationInput)) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      submit(
        {
          name: nameInput,
          description: textAreaInput,
          location: JSON.stringify(locationInput),
          intent: 'edit-neighborhood',
        },
        {
          method: 'put',
          action: `/neighborhoods/${neighborhoodId}`,
        },
      );
      handleClose();
      setFormSubmitted(false);
    }
  };

  return (
    <Modal show={show} onHide={closeModal} animation={true} backdrop="static" centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Neighborhood</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form role="form" noValidate onSubmit={handleSubmit} className={styles.createReqForm}>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label column="sm">
              Title<span className={styles.asterisk}>*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={nameInput}
              minLength={4}
              maxLength={30}
              isInvalid={!validInputPattern.test(nameInput) && formSubmitted}
              isValid={validInputPattern.test(nameInput)}
              onChange={(event) => {
                setNameInput(event?.target.value);
                setFormSubmitted(false);
              }}
              required
            />
            <Form.Control.Feedback type="invalid">
              Please choose a valid title.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="location">
            <Form.Label column="sm">
              Location<span className={styles.asterisk}>*</span>
            </Form.Label>
            <InputGroup>
              <AsyncTypeahead
                className="w-100"
                id="location"
                delay={500}
                onSearch={async (query) => {
                  setIsLoading(true);
                  const locations = await provider.search({ query });
                  locationsRef.current = locations;
                  setIsLoading(false);
                }}
                onChange={(selected) => {
                  // @ts-ignore
                  setLocationInput(selected[0]);
                }}
                onInputChange={(_text, _event) => {
                  setLocationInput(null);
                }}
                isLoading={isLoading}
                filterBy={() => true}
                // @ts-ignore
                options={locationsRef.current}
                placeholder="Choose a location..."
                // eslint-disable-next-line no-unneeded-ternary
                isValid={isValidLocation(locationInput)}
                isInvalid={!isValidLocation(locationInput)}
                // @ts-ignore
                defaultInputValue={location ? location.label : undefined}
              />
              <Form.Control.Feedback type="invalid">
                Please choose a valid address!
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
          <Form.Group className="mb-2" controlId="description">
            <Form.Label column="sm">
              Description<span className={styles.asterisk}>*</span>
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={6}
              name="description"
              value={textAreaInput}
              onChange={(event) => {
                setTextAreaInput(event?.target.value);
                setFormSubmitted(false);
              }}
            />
            <Form.Control.Feedback type="invalid">
              The description needs to be at least 4 characters long.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Text className="text-muted">
              Fields marked with <span className={styles.asterisk}>*</span> are required.
            </Form.Text>
          </Form.Group>
          <Form.Group>
            <Form.Control type="hidden" name="intent" value="edit-neighborhood" />
          </Form.Group>
          <Container className={styles.btnContainer} fluid>
            <Row className="gx-3 gy-2">
              <Col sm={6}>
                <CustomBtn variant="primary" type="submit" className={`${styles.btn}`}>
                  Submit
                </CustomBtn>
              </Col>
              <Col sm={6}>
                <CustomBtn variant="outline-dark" onClick={closeModal} className={styles.btn}>
                  Cancel
                </CustomBtn>
              </Col>
            </Row>
          </Container>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
