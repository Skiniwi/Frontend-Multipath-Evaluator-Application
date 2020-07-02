import React, { useState, useEffect } from "react";
import "../../App.css";
import {
    Input, FormGroup, DropdownToggle, DropdownMenu, DropdownItem,
    InputGroupButtonDropdown, Navbar, ButtonDropdown, Collapse, Button, Navbar

} from 'reactstrap';

function DropdownButtonEvaluationReceiver(props) {
    //Split Down Button for Evaluation
    const [splitButtonOpen, setSplitButtonOpen] = useState(false);
    const toggleSplit = () => setSplitButtonOpen(!splitButtonOpen);
    const [firstdropdownOpen, setFirstDropdownOpen] = useState(false);
    const scenarios = () => setFirstDropdownOpen(!firstdropdownOpen);
    const [paths, setPaths] = useState([])

    useEffect(() => {
        if (!props.pathss) {
            return
        }
        setPaths(props.pathss);
    }, [props.pathss]);

    const [key, setKey] = useState([])
    function KeysFunction() {
        paths.map(function (item) {
            item.map(function (path) {
                const keypath = Object.keys(path);
                setKey(keypath);
            });
            return null;
        });
    }

    const [collapse, setCollapse] = useState(true);
    const [status, setStatus] = useState('Opened');
    const onEntering = () => setStatus('Opening...');
    const onEntered = () => setStatus('Opened');
    const onExiting = () => setStatus('Closing...');
    const onExited = () => setStatus('Closed');
    const toggle = () => setCollapse(!collapse);


    return (


        <Navbar dark expand="md">
            <InputGroupButtonDropdown addonType="prepend" isOpen={splitButtonOpen} toggle={toggleSplit} >
                <ButtonDropdown isOpen={firstdropdownOpen} toggle={scenarios}>
                    <DropdownToggle onClick={KeysFunction} caret> Evaluation</DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem header>Select X Axis </DropdownItem>
                        <FormGroup>
                            <Input type="select" name='select' id="xSelect">
                                {key.length > 0 && key1.map(item => <option>{item}</option>)}
                            </Input>
                        </FormGroup>
                        <DropdownItem header>Select Y Axis </DropdownItem>
                        <FormGroup>
                            <Input type="select" name="select" id="ySelect" multiple>
                                {key1.length > 0 && key.map(item => <option>{item}</option>)}
                            </Input>
                        </FormGroup>
                        <DropdownItem divider />
                        <DropdownItem>Start Evaluation</DropdownItem>
                    </DropdownMenu>
                </ButtonDropdown>
            </InputGroupButtonDropdown>
        </Navbar>
            </Collapse >


        </div >

    );
}
export default DropdownButtonEvaluationReceiver;