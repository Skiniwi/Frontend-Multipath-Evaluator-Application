import React, { useState, useEffect } from "react";
import "../../App.css";
import {
    Input, FormGroup, DropdownItem, Button, ButtonGroup,
    Navbar, Collapse, Spinner

} from 'reactstrap';
import Chart from "./Chart ";
import ChartCdf from "./ChartCdf";
import uuid from 'react-uuid';


function DropdownButtonEvaluation(props) {
    //Split Down Button for Evaluation
    const paths = []
    const [points, setPoints] = useState([]);

    useEffect(() => {
        if (!props.points) {
            return
        }
        setPoints(props.points);
    }, [props.points]);

    points.map(function (item) {
        paths.push(item.paths);
        return null

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
    function xFunction() {
        paths.forEach(function (item) {
            item.forEach(function (path) {
                if (keypath1.includes(selectedValuex)) {
                    path.interactions.forEach(j => {
                        if (selectedValuex === "aoa" || "aod" || "material_id" || "interacted_obj_id") {
                            x.push(j[selectedValuex])
                        }
                        else {
                            console.log("hi")
                        }
                    });
                }
                if (selectedValuex === "power" || "num_of_interactions" || "field_strength" || "delay") {
                    x.push(path[selectedValuex])
                }
                else {
                    console.log("hello")
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
                        else {
                            console.log("Hi")
                        }
                    });
                }
                if (selectedValuey !== "num_of_interactions" || "type_of_path") {
                    y.push(path[selectedValuey])
                }
                else {
                    console.log("Hi")
                }
            });
        });
    }

    const [charts, setCharts] = useState([])
    function createNewChart() {
        setCharts(p => [...p, {
            x,
            y,
            selectedValuex,
            selectedValuey
        }]);
        return null
    }
    const [chartscdf, setChartsCdf] = useState([])
    function createNewChartCdf() {
        setChartsCdf(p => [...p, {
            x,
            selectedValuex,
        }]);
        return null
    }

    const [selectedchart, setSelectedchart] = useState('CDF Chart')
    function handleChangetypeofchart(event) { setSelectedchart(event.target.value) }
    const choosechart = () => { selectedchart === "CDF Chart" ? createNewChartCdf() : createNewChart() }
    const [collapse, setCollapse] = useState(true);
    const [status, setStatus] = useState('Evaluation ');
    const onEntering = () => setStatus(<Spinner size="sm" color="light" />);
    const onEntered = () => setStatus('Evaluation Window');
    const onExiting = () => setStatus(<Spinner size="sm" color="light" />)
    const onExited = () => setStatus('Click to Evaluate');
    const toggle = () => setCollapse(!collapse);

    return (
        <>
            <div className="openandclosebuttonnav">
                <Navbar className="nav_button" expand="sm">
                    <div className="headernav" > {status}</div>
                    <Button className="btn_in_nav_button" size="sm" dark="true" onClick={toggle} >
                        {collapse ? onExited && <i className="arrow up"></i> : <i className="arrow down"></i>}
                    </Button>
                </Navbar>
                <Collapse
                    isOpen={collapse}
                    onEntering={onEntering}
                    onEntered={onEntered}
                    onExiting={onExiting}
                    onExited={onExited}
                >
                    <div className="windowbutton" >
                        <ButtonGroup className="button" size="sm">
                            <FormGroup onClick={KeysFunction}>
                                <DropdownItem header> <div className="headerdropdownitem" >Select type of chart </div > </DropdownItem>
                                <Input type="select" name="select" id="selectchart" defaultChecked
                                    value={selectedchart} onChange={handleChangetypeofchart} >
                                    <option >CDF Chart</option>
                                    <option >Scatter Chart</option>

                                </Input>
                            </FormGroup>
                        </ButtonGroup>

                        <ButtonGroup className="button" size="sm">
                            <FormGroup onClick={KeysFunction}>
                                <DropdownItem header ><div className="headerdropdownitem" >Select X Axis </div ></DropdownItem>
                                <Input type="select" name='select' id="xSelect" defaultChecked
                                    value={selectedValuex} onChange={handleChangex} >
                                    {key1.length > 0 && key1.map((item1, index1) => <option key={index1} >{item1}</option>)}
                                </Input>
                            </FormGroup>

                            {selectedchart === "Scatter Chart" ? < FormGroup onClick={KeysFunction}>
                                <DropdownItem header><div className="headerdropdownitem" >Select Y Axis </div > </DropdownItem>
                                <Input type="select" name="select" id="ySelect" defaultChecked
                                    value={selectedValuey} onChange={handleChangey} >
                                    {key2.length > 0 && key2.map((item, index) => <option key={index} >{item}</option>)}
                                </Input>
                            </FormGroup> : ''}
                        </ButtonGroup>

                        <ButtonGroup className="buttonevaluation" size="sm">
                            <FormGroup>
                                <Button onClick={() => { choosechart(); yFunction(); xFunction(); }} >Start Evaluation</Button>
                            </FormGroup>
                        </ButtonGroup>
                    </div>
                </Collapse>
            </div>

            <div className="window">

                {charts.map(({ x, y, selectedValuex, selectedValuey }, index) => (
                    <Chart key={uuid()} x={x} y={y} selectedValuex={selectedValuex} selectedValuey={selectedValuey} />
                ))}
                {chartscdf.map(({ x, selectedValuex }) => (
                    <ChartCdf key={uuid()} x={x} selectedValuex={selectedValuex} />
                ))}
            </div>
        </>
    );
}
export default DropdownButtonEvaluation;


