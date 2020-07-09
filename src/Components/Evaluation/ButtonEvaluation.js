import React, { useState, useEffect } from "react";
import "../../App.css";
import {
    Input, FormGroup, DropdownItem, Button, ButtonGroup,
    Navbar, Collapse, Spinner

} from 'reactstrap';
import uuid from 'react-uuid';
import Chart from "./Chart";
import Evaluation from "../Evaluation/Evaluation";

function DropdownButtonEvaluation(props) {
    //Split Down Button for Evaluation
    const paths = []
    const [points, setPoints] = useState([]);
    const [id, setIdPoint] = useState(null);
    useEffect(() => {
        if (!props.points) {
            return
        }
        setPoints(props.points);
        setIdPoint(props.idd)

    }, [props.points, props.idd]);
    points.map(function (item) {
        if (id === item.point_id) {
            paths.push(item.paths)
            return null
        }
    })


    const [key1, setKey1] = useState([])
    const [key2, setKey2] = useState([])

    const [keypath1, setKeypath1] = useState([])
    const [keypath2, setKeypath2] = useState([])
    function KeysFunction() {
        paths.forEach(function (item) {
            item.forEach(function (path) {
                if (path.num_of_interactions !== 0) {
                    path.interactions.forEach(j => {
                        setKeypath1(Object.keys(j))
                    })
                }
                else if (path.num_of_interactions === 0) {
                    setKeypath2(Object.keys(path));
                }

                let keypath = [...keypath1, ...keypath2]
                setKey1(keypath)
                setKey2(keypath)
            });

        });

    }

    const [selectedValuex, setSelectedValuex] = useState('aoa')
    const [selectedValuey, setSelectedValuey] = useState('aoa')
    function handleChangex(event) { setSelectedValuex(event.target.value) }
    function handleChangey(event) { setSelectedValuey(event.target.value) }
    const x = []
    const y = []
    const [returnn, setReturnn] = useState(false)
    const ignorekeys = ["position", "material_id", "interaction_type", "interactions", "interacted_obj_id", "num_of_interactions", "type_of_path"]
    const clearStateAlert = () => setReturnn(false); if (returnn === true) { alert("Please select another option from the drop down !"); clearStateAlert() }
    const returnnn = () => { setReturnn(true); return }
    function xFunction() {
        paths.forEach(function (item) {
            item.forEach(function (path) {
                if (keypath1.includes(selectedValuex)) {
                    path.interactions.forEach(j => {
                        x.push(j[selectedValuex])
                        if (ignorekeys.includes(selectedValuex)) {
                            returnnn()
                        }
                    });
                }
                x.push(path[selectedValuex])
                if (ignorekeys.includes(selectedValuex)) {
                    returnnn()
                }
            });
        });
    }
    function yFunction() {
        paths.forEach(function (item) {
            item.forEach(function (path) {
                if (keypath1.includes(selectedValuey)) {
                    path.interactions.forEach(j => {
                        if (selectedValuey !== ("position" || "interacted_obj_id" || "material_id" || "interaction_type")) {
                            y.push(j[selectedValuey])
                        }
                        if (ignorekeys.includes(selectedValuey)) {
                            returnnn()
                        }
                    });
                }
                if (selectedValuey !== "num_of_interactions" || "type_of_path") {
                    y.push(path[selectedValuey])
                }
                if (ignorekeys.includes(selectedValuey)) {
                    returnnn()
                }
            });
        });

    }

    const [selectedchart, setSelectedchart] = useState("CDF Chart")
    function handleChangetypeofchart(event) { setSelectedchart(event.target.value) }
    // const choosechart = () => { selectedchart === "CDF Chart" ? createNewChartCdf() : createNewChart() }
    const [collapse, setCollapse] = useState(true);
    const [status, setStatus] = useState('Evaluation ');
    const onOpening = () => setStatus(<Spinner size="sm" color="light" />);
    const onOpen = () => setStatus('Evaluation Window');
    const onClosing = () => setStatus(<Spinner size="sm" color="light" />)
    const onClosed = () => setStatus('Click to Evaluate');
    const toggle = () => setCollapse(!collapse);



    let [newchart, setNewchart] = useState([])
    function createNewNewChart() {
        setNewchart(p => [...p, {
            selectedchart,
            x,
            y,
            selectedValuex,
            selectedValuey,

        }]);
    }
    //This function create a duplicate of newchart in copyNewchart after delete the selected object using the index after reset the newchart
    const deleteChart = (index) => {
        const copyNewchart = Object.assign([], newchart);
        copyNewchart.splice(index, 1);
        setNewchart(newchart = copyNewchart)
    };

    return (
        <>
            <div id={uuid()} className="openandclosebuttonnav">
                <Navbar className="nav_button" expand="sm">
                    <div className="headernav" > {status}</div>
                    <Button className="btn_in_nav_button" size="sm" dark="true" onClick={toggle} >
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
                    <div className="windowbutton" >
                        <ButtonGroup className="button" size="sm">
                            <FormGroup onClick={KeysFunction}>
                                <DropdownItem header> <div className="headerdropdownitem" >Select type of chart </div > </DropdownItem>
                                <Input className="btn_in_window_evaluation" type="select" name="select" id="selectchart" defaultChecked
                                    value={selectedchart} onChange={handleChangetypeofchart} >
                                    <option >CDF Chart</option>
                                    <option >Scatter Chart</option>
                                </Input>
                            </FormGroup>
                        </ButtonGroup>

                        <ButtonGroup className="buttonx" size="sm">
                            <FormGroup onClick={KeysFunction}>
                                <DropdownItem header ><div className="headerdropdownitem" >Select X Axis </div ></DropdownItem>
                                <Input className="btn_in_window_evaluation" type="select" name='select' id="xSelect" defaultChecked
                                    value={selectedValuex} onChange={handleChangex} >
                                    {key1.length > 0 && key1.map((item1, index1) => <option key={index1} >{item1}</option>)}
                                </Input>
                            </FormGroup>

                            {selectedchart === "Scatter Chart" ? < FormGroup onClick={KeysFunction}>
                                <DropdownItem header><div className="headerdropdownitem" >Select Y Axis </div > </DropdownItem>
                                <Input className="btn_in_window_evaluation" type="select" name="select" id="ySelect" defaultChecked
                                    value={selectedValuey} onChange={handleChangey} >
                                    {key2.length > 0 && key2.map((item, index) => <option key={index} >{item}</option>)}
                                </Input>
                            </FormGroup> : ''}
                        </ButtonGroup>

                        <ButtonGroup className="buttonevaluation" size="sm">
                            <FormGroup>
                                <Button onClick={() => { yFunction(); xFunction(); createNewNewChart() }} >Start Evaluation</Button>
                            </FormGroup>
                        </ButtonGroup>
                    </div>
                </Collapse>
            </div>

            <div className="window">
                {newchart.length > 0 && newchart.map(({ x, y, selectedValuex, selectedValuey, selectedchart }, index) => (
                    <Chart key={uuid()} x={x} y={y} selectedValuex={selectedValuex}
                        selectedValuey={selectedValuey} selectedchart={selectedchart} deleteChart={() => deleteChart(index)} />
                ))}
            </div>
        </>
    );
}
export default DropdownButtonEvaluation;


