import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import {
  Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Navbar, Button, ButtonGroup,
  ButtonDropdown
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
function AddRequest() {
  const [addRequest] = useMutation(ADD_REQUEST);
  const handleAddRequest = () => {
    addRequest({
      variables: { serviceID: "service_sum", content: "sudo" },
    });
  };


  //Down Button for Select Scenario
  const [firstdropdownOpen, setFirstDropdownOpen] = useState(false);
  const scenarios = () => setFirstDropdownOpen(!firstdropdownOpen);
  const [seconddropdownOpen, setSecondDropdownOpen] = useState(false);
  const altair = () => setSecondDropdownOpen(!seconddropdownOpen);
  const [thirddropdownOpen, setThirdDropdownOpen] = useState(false);
  const matlab = () => setThirdDropdownOpen(!thirddropdownOpen);




  return (
    <>
      <div className="windowaddrequest" >
        <Navbar className="buttonaddrequest" dark expand="md">
          <ButtonGroup size="sm">
            <Button onClick={handleAddRequest}>Quick test</Button>

            <ButtonDropdown isOpen={firstdropdownOpen} toggle={scenarios}>
              <DropdownToggle caret> Scenarios</DropdownToggle>
              <DropdownMenu>

                <Dropdown size="sm" direction="left" isOpen={seconddropdownOpen} toggle={altair}>
                  <DropdownToggle caret>Altair Scenario</DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem onClick={handleAddRequest}>Leipzig</DropdownItem>
                    <DropdownItem>Bonn</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
                <Dropdown size="sm" direction="right" isOpen={thirddropdownOpen} toggle={matlab}>
                  <DropdownToggle caret>Matlab Scenario</DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem>Leipzig</DropdownItem>
                    <DropdownItem>Bonn</DropdownItem>
                  </DropdownMenu>
                </Dropdown>

              </DropdownMenu>
            </ButtonDropdown>
          </ButtonGroup>
        </Navbar>
      </div>

    </>
  );
}

export default AddRequest;
