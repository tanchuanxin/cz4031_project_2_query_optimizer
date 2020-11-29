import { useState } from 'react';
import axios from "axios";

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Accordion from 'react-bootstrap/Accordion'
import Card from 'react-bootstrap/Card'

import FormOutput from "../FormOutput/FormOutput";

const FormInput = () => {
  const [input, setInput] = useState({
    "query": "",
    "predicates": [],
    "selectivity": 50,
  });
  const [output, setOutput] = useState({
    "data": {},
    "status": "",
    "error": false
  });

  const [showAlert, setAlert] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setOutput((oldState) => {
      return (
        {...oldState, "status": "Generating output...", "error": false}
      )
    })

    if (input.query !== "") {
      axios.post("/generate", input)
        .then((response) => {
          // Handle error gracefully
          if (response.status === false) {
            setOutput((oldState) => { 
              return (
                {...oldState, "status": "Error generating output. Please check your query.", "error": true}
              )
            })
          }
          else {
            console.log(response.data);
            setOutput((oldState) => { 
              return (
                {...oldState, "data": response.data["data"], "status": "Succesfully received output. Displaying...", "error": false}
              )
            })
          }
      })
      .catch((error) => {
        setOutput((oldState) => { 
          return (
            {...oldState, "status": "Error generating output. Please check your query.", "error": true}
          )
        })
      })
    }
    else {
      setOutput((oldState) => { 
        return (
          {...oldState, "status": "Error generating output. Please input an SQL query.", "error": true}
        )
      })
    }
  }

  const limitPredicates = (event) => {
    let timeout;
    if (typeof(timeout) !== undefined) {
      setTimeout(() => { setAlert(false); }, 2000);
      setAlert(true);
    }

    event.target.checked = false;
  }

  const handleChecked = (event) => {
    setInput(oldState => {
      const index = oldState.predicates.indexOf(event.target.id);

      if (event.target.checked) {
        if (index <= -1) {
          // If too many, stop user from choosing more.
          if (oldState.predicates.length >= 4) {
            limitPredicates(event);
            return (oldState);
          }
          oldState.predicates.push(event.target.id)
        }
      }
      else {
        if (index > -1) {
          oldState.predicates.splice(index, 1);
        }
      }

      return ({ ...oldState, "predicates": oldState.predicates });
    });
  }

  const resetForm = (event) => {
    setInput({
      "query": "",
      "predicates": [],
      "selectivity": 50,
    });
    setOutput({
      "data": {},
      "status": "",
      "error": false
    });
  }

  const showSelectedPredicates = () => {
    if (input.predicates && input.predicates.length > 0) {
      let selectedPredicates = "";
      input.predicates.forEach((predicate) => {
        selectedPredicates += `${predicate}, `
      })
      return (selectedPredicates.slice(0, selectedPredicates.length-2));
    }
    else {
      return "";
    }
  }

  return (
    <>
      {
        showAlert ? <Card className="position-fixed" style={{ zIndex: 100, backgroundColor: "red", color: "white", top: 50 + '%', left: 50 + '%', transform: `translate(-50%, -50%)`}}>
        <Card.Body>You may only select a maximum of 4 predicates.</Card.Body>
      </Card> : null
      }
      
      <Form onSubmit={handleSubmit} className="mb-4">
        <Form.Row>
          <Form.Group as={Col} controlId="formPredicatesInput">
            <Form.Label>Selected predicates</Form.Label>
            <Form.Control value={showSelectedPredicates()} readOnly />
          </Form.Group>
        </Form.Row>

        <Form.Row>
          <Form.Group as={Col} controlId="formPredicates">
            <Form.Label>Predicates</Form.Label>
            <Accordion>
              <Card>
                <Accordion.Toggle as={Card.Header} variant="link" eventKey="0">
                  Region
                </Accordion.Toggle>
                <Accordion.Collapse eventKey="0">
                  <Card.Body>
                    {["r_regionkey"].map((type) => (
                      <Form.Check
                        type="checkbox" key={type} id={type} label={type} onClick={handleChecked} />
                    ))}
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
              <Card>
                <Accordion.Toggle as={Card.Header} variant="link" eventKey="1">
                  Nation
                </Accordion.Toggle>
                <Accordion.Collapse eventKey="1">
                  <Card.Body>
                    {["n_nationkey"].map((type) => (
                      <Form.Check
                        type="checkbox" key={type} id={type} label={type} onClick={handleChecked} />
                    ))}
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
              <Card>
                <Accordion.Toggle as={Card.Header} variant="link" eventKey="2">
                  Supplier
                </Accordion.Toggle>
                <Accordion.Collapse eventKey="2">
                  <Card.Body>
                    {["s_suppkey", "s_acctbal"].map((type) => (
                      <Form.Check
                        type="checkbox" key={type} id={type} label={type} onClick={handleChecked} />
                    ))}
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
              <Card>
                <Accordion.Toggle as={Card.Header} variant="link" eventKey="3">
                  Customer
                </Accordion.Toggle>
                <Accordion.Collapse eventKey="3">
                  <Card.Body>
                    {["c_custkey", "c_acctbal"].map((type) => (
                      <Form.Check
                        type="checkbox" key={type} id={type} label={type} onClick={handleChecked} />
                    ))}
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
              <Card>
                <Accordion.Toggle as={Card.Header} variant="link" eventKey="4">
                  Part
                </Accordion.Toggle>
                <Accordion.Collapse eventKey="4">
                  <Card.Body>
                    {["p_partkey", "p_retailprice"].map((type) => (
                      <Form.Check
                        type="checkbox" key={type} id={type} label={type} onClick={handleChecked} />
                    ))}
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
              <Card>
                <Accordion.Toggle as={Card.Header} variant="link" eventKey="5">
                  PartSupp
                </Accordion.Toggle>
                <Accordion.Collapse eventKey="5">
                  <Card.Body>
                    {["ps_partkey", "ps_suppkey", "ps_availqty", "ps_supplycost"].map((type) => (
                      <Form.Check
                        type="checkbox" key={type} id={type} label={type} onClick={handleChecked} />
                    ))}
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
              <Card>
                <Accordion.Toggle as={Card.Header} variant="link" eventKey="6">
                  Orders
                </Accordion.Toggle>
                <Accordion.Collapse eventKey="6">
                  <Card.Body>
                    {["o_orderkey", "o_custkey", "o_totalprice", "o_orderdate"].map((type) => (
                      <Form.Check
                        type="checkbox" key={type} id={type} label={type} onClick={handleChecked} />
                    ))}
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
              <Card>
                <Accordion.Toggle as={Card.Header} variant="link" eventKey="7">
                  LineItem
                </Accordion.Toggle>
                <Accordion.Collapse eventKey="7">
                  <Card.Body>
                    {["l_orderkey", "l_partkey", "l_suppkey", "l_extendedprice", "l_shipdate", "l_commitdate", "l_receiptdate"].map((type) => (
                      <Form.Check
                        type="checkbox" key={type} id={type} label={type} onClick={handleChecked} />
                    ))}
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            </Accordion>
          </Form.Group>

          <Form.Group as={Col} controlId="formInput">
            <Form.Group controlId="formQuery">
                <Form.Label>SQL Query</Form.Label>
                <Form.Control as="textarea" rows="19" placeholder="Input SQL query..." onChange={event => setInput({...input, "query": event.target.value})} value={input.query} />
              <Row>
                <Col>
                  <Button onClick={ resetForm } variant="secondary" type="reset" className="w-100 mt-3">
                  Reset
                  </Button>
                </Col>
                <Col>
                  <Button variant="primary" type="submit" className="w-100 mt-3">
                  Generate
                  </Button>
                </Col>
              </Row>
            </Form.Group>
          </Form.Group>
        </Form.Row>
      </Form>

      <FormOutput output={output}/>
    </>
  )
}
      
export default FormInput;