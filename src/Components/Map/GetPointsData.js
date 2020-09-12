import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import {
  ListGroupItem, Button, Navbar, Collapse, Spinner
} from 'reactstrap';

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

function AddRequest(props) {
  const [files, setFiles] = useState([])
  useEffect(() => {
    if (!props.files) {
      return
    }
    setFiles(props.files);
  }, [props.files]);

  const [addRequest] = useMutation(ADD_REQUEST);

  const [selectedNameOfFile, setSelectedNameOfFile] = useState('BMW_Altair')


  function handleChange(event) { setSelectedNameOfFile(event.target.value) }

  const handleAddRequest = (event) => {
    addRequest({
      variables: {
        serviceID: "service_sum", content: selectedNameOfFile
      },
    });
  };


  const [collapse, setCollapse] = useState(false);
  const [status, setStatus] = useState('Scenarios ');
  const onOpening = () => setStatus(<Spinner size="sm" color="light" />);
  const onOpen = () => setStatus('Please Choose Scenario');
  const onClosing = () => setStatus(<Spinner size="sm" color="light" />)
  const onClosed = () => setStatus('Scenarios');
  const toggle = () => setCollapse(!collapse);


  return (
    <>
      <div className="openandclosebuttonnavrequest">
        <Button className="buttomgetscenario" onClick={handleAddRequest} > Click here to Start </Button>
        <Navbar className="nav_button1" expand="sm">
          <div className="headernav1" > {status}</div>
          <Button className="btn_in_nav_button1" size="sm" dark="true" onClick={() => { toggle(); props.handleAddRequest11() }} >
            {collapse ? onClosed && <i className="arrow up"></i> : <i className="arrow down"></i>}
          </Button>
        </Navbar>
        <Collapse
          isOpen={collapse}
          onEntering={onOpening}
          onEntered={onOpen}
          onExiting={onClosing}
          onExited={onClosed}
        >
          <Navbar expand="md">
            <div className="getscenario" >
              {files.length > 0 && files.map((item, index1) =>
                < ListGroupItem action tag="button" className="btn_in_window_evaluation" type="select" name='select' id="Select" color="dark"
                  value={item} key={index1} onClick={handleChange}> {item}
                </ListGroupItem>)}
            </div >

          </Navbar>
        </Collapse>
      </div>

    </>
  );
}
export default AddRequest;
