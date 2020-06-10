import React from "react";
import { useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { Navbar } from "react-bootstrap";
import { Button } from "react-bootstrap";
const ADD_REQUEST = gql`
  mutation createRequest($content: String!, $serviceID: String!) {
    createRequest(
      input: {
        contentType: "application/json"
        serviceID: $serviceID
        content: $content
        acceptContentType: "application/json"
        forceUpdate: true
      }
    ) {
      id
      status
    }
  }
`;


function AddRequest() {
  const [addRequest] = useMutation(ADD_REQUEST);
  const handleAddRequest = () => {
    addRequest({
      variables: { serviceID: "service_sum", content: "sudo" },
    });
  };
  return (
    <>
      <form>
        <Navbar expand="md" bg="dark" variant="dark">
          {<Button variant="dark" size="sm" onClick={handleAddRequest}>
            TX Marker Data
          </Button>}
          {<Button variant="dark" size="sm" onClick={handleAddRequest}>
            RX Marker
          </Button>}

        </Navbar >
      </form>
    </>
  );
}

export default AddRequest;
