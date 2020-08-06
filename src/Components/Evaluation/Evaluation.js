import React, { useState, useEffect } from "react";
import "../../App.css";
import {
    Input, FormGroup, DropdownItem, Button, ButtonGroup,
    Navbar, Collapse, Spinner

} from 'reactstrap';
import uuid from 'react-uuid';
import Chart from "./Chart";
import * as turf from "@turf/turf";
import { ExportReactCSV } from '../ExportCsv';

function Evaluation(props) {
    //Split Down Button for Evaluation
    const calculatedData = []
    const delay_array = [];
    const strength_array = [];
    const sq_st_ar = [];
    const dl_by_st = [];
    const sq_delay_by_strength = [];
    const power_array = [];
    const power_array_mw = [];
    const avg_strength_array = [];
    const path_distance = [];
    const options = { units: "meters" };
    const paths = []
    const [points, setPoints] = useState([]);
    const [id, setIdPoint] = useState(null);
    const [transmitter, setTransmitter] = useState([]);
    let calculated = {}
    let calculate = {}
    let calculated_all_rec = {}
    // const calculateddataallpoints = []
    const calculateddata = []
    const avg_power_array = []
    const [savepoint, setSavedPoint] = useState([]);
    const savedPoint = [...savepoint]
    const save = []
    const strength_array_all_rec = []
    const sq_delay_by_strength_all_rec = []
    const dl_by_st_all_rec = []
    useEffect(() => {
        if (!props.points) {
            return
        }
        setPoints(props.points);
        setIdPoint(props.idd);
        setTransmitter(props.tx);

    }, [props.points, props.idd, props.tx]);
    points.map(function (item) {
        if (id === item.point_id) {
            paths.push(item.paths)
        } return null
    })
    // const [selectedPoint, setSelectedPointlatlon] = useState([]);

    points.forEach(d => {
        //calculate the delay spread
        for (let i = 0; i < d.paths.length; i++) {

            strength_array_all_rec.push(d.paths[i].field_strength);
            sq_delay_by_strength_all_rec.push(Math.pow(d.paths[i].delay, 2) * d.paths[i].field_strength);
            dl_by_st_all_rec.push(d.paths[i].delay * d.paths[i].field_strength);

        }
        const expectation_delay_all_rec = dl_by_st_all_rec.reduce((previous, current) => current + previous, 0) / strength_array_all_rec.reduce((previous, current) => current + previous, 0);
        const expectation_delay_sq_all_rec = sq_delay_by_strength_all_rec.reduce((previous, current) => current + previous, 0) / strength_array_all_rec.reduce((previous, current) => current + previous, 0);
        const delaySpread_all_points = Math.sqrt(expectation_delay_sq_all_rec - Math.pow(expectation_delay_all_rec, 2));
        if (id === d.point_id) {
            const selectedPoint = [d.position.lat, d.position.lon]
            let polyline_0 = [selectedPoint, transmitter];
            const toPoly_0 = turf.lineString(polyline_0);
            const distancePoly_0 = turf.length(toPoly_0, options);
            path_distance.push(distancePoly_0);

            for (let i = 0; i < d.paths.length; i++) {
                delay_array.push(d.paths[i].delay);
                strength_array.push(d.paths[i].field_strength);
                //The Math.pow() function returns the base to the exponent power, that is, base ^exponent.
                sq_st_ar.push(Math.pow(d.paths[i].field_strength, 2));
                dl_by_st.push(d.paths[i].delay * d.paths[i].field_strength);
                sq_delay_by_strength.push(Math.pow(d.paths[i].delay, 2) * d.paths[i].field_strength);
                power_array_mw.push(Math.pow(10, (d.paths[i].power / 10)));
                power_array.push(d.paths[i].power);


                if (d.paths[i].num_of_interactions === 1 && selectedPoint.length > 0) {
                    d.paths[i].interactions.forEach(j => {
                        let polyline = [selectedPoint, [j.position.lat, j.position.lon], transmitter];
                        const toPoly = turf.lineString(polyline);
                        const distancePoly = turf.length(toPoly, options);
                        path_distance.push(distancePoly);
                    });
                }
                //The Math.sqrt() function returns the square root of a number//
                //The reduce() method executes a reducer function (that you provide) on each element of the array, resulting in single output value. //
                //Calculate delay and average of delay:
                const sum_delay = delay_array.reduce((previous, current) => current + previous, 0);
                const avg_delay = sum_delay / delay_array.length;
                //Calculate power and average of power:
                const sum_power = power_array_mw.reduce((previous, current) => current + previous, 0);
                const avg_power = 10 * Math.log10(sum_power / power_array_mw.length);
                //Calculate strength and average of strength:
                const sum_strength = sq_st_ar.reduce((previous, current) => current + previous, 0);
                const avg_strength = Math.sqrt(sum_strength / strength_array.length);
                //The parseInt() function parses a string argument and returns an integer of the specified
                const n_avg_power = parseInt(avg_power, 10);
                avg_power_array.push(n_avg_power);

                const n_avg_str = parseInt(avg_strength, 10);
                avg_strength_array.push(n_avg_str);
                //calculate the delay spread
                const expectation_delay = dl_by_st.reduce((previous, current) => current + previous, 0) / strength_array.reduce((previous, current) => current + previous, 0);
                const expectation_delay_sq = sq_delay_by_strength.reduce((previous, current) => current + previous, 0) / strength_array.reduce((previous, current) => current + previous, 0);
                const delaySpread = Math.sqrt(expectation_delay_sq - Math.pow(expectation_delay, 2));
                calculated = {
                    power_array: power_array,
                    strength_array: strength_array,
                    avg_power_array: avg_power_array,
                    avg_strength_array: avg_strength_array,
                    delay_array: delay_array,
                    path_distance: path_distance,
                }
                calculate = {
                    iddd: id,
                    sum_delay: sum_delay,
                    avg_delay: avg_delay,
                    sum_power: sum_power,
                    avg_power: avg_power,
                    sum_strength: sum_strength,
                    avg_strength: avg_strength,
                    expectation_delay: expectation_delay,
                    expectation_delay_sq: expectation_delay_sq,
                    delaySpread: delaySpread,
                    path_distance: path_distance,
                }
            }

        }
        calculatedData.push(calculated);
        calculated_all_rec = {
            delaySpread_all_points: delaySpread_all_points,
        }
        calculateddata.push(calculate)

        // calculateddataallpoints.push(calculated_all_rec)

    });

    console.log(calculated_all_rec)
    const saveData = calculateddata.filter(value => Object.keys(value).length !== 0);
    if (saveData !== undefined) {
        save.push(saveData[0])
    }
    const [key1, setKey1] = useState([])
    const [key2, setKey2] = useState([])
    const [keypath1, setKeypath1] = useState([])
    // const [keypath2, setKeypath2] = useState([])
    const [keyCalculatedData, setkeyCalculatedData] = useState([])
    function KeysFunction() {
        calculatedData.forEach(j => {
            setkeyCalculatedData(Object.keys(j))
        })
        paths.forEach(function (item) {
            item.forEach(function (path) {
                // if (path.num_of_interactions !== 0) {
                path.interactions.forEach(j => {
                    setKeypath1(Object.keys(j))
                })
                // }
                //  if (path.num_of_interactions === 0) {
                // setKeypath2(Object.keys(path));
                // }
                const keypath = [...keypath1, ...keyCalculatedData]
                setKey1(keypath)
                setKey2(keypath)
            });
        });
        props.evaluationn(calculateddata);

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
        if (key1.includes(selectedValuex)) {
            const filtered = calculatedData.filter(function (el) {
                return el !== null;
            })
            filtered.forEach(function (j) {
                if (j[selectedValuex] !== undefined) {
                    for (let i = 0; i < j[selectedValuex].length; i++) {
                        x.push(j[selectedValuex][i])
                    }
                }
            })

        }
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
                // if (calculatedData.length > 0) {
                //     calculatedData[0].selectedValuex.map(j => { x.push(j) })
                // }
                if (ignorekeys.includes(selectedValuex)) {
                    returnnn()
                }
                // x.push(path[selectedValuex])
                // calculatedData[0].power_array.map(j => { console.log(j) })

            });
        });

    }

    function yFunction() {
        if (key2.includes(selectedValuey)) {
            const filtered = calculatedData.filter(function (el) {
                return el !== null;
            })
            filtered.forEach(function (j) {
                if (j[selectedValuey] !== undefined) {
                    for (let i = 0; i < j[selectedValuey].length; i++) {
                        y.push(j[selectedValuey][i])
                    }
                }
            })
        }
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
                if (ignorekeys.includes(selectedValuey)) {
                    returnnn()
                }
                // y.push(path[selectedValuey]) || y.push(calculatedData[0].power_array)

            });
        });
        // y.push(calculatedData.selectedValuex)

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
        setSavedPoint([...savepoint, ...save])
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

                        {id > null && <ButtonGroup className="buttonevaluation" size="sm">
                            <FormGroup>
                                <Button onClick={() => { yFunction(); xFunction(); createNewNewChart() }} >Start Evaluation</Button>
                            </FormGroup>
                        </ButtonGroup>}
                    </div>
                </Collapse>
            </div>

            <div className="window">
                {newchart.length > 0 && <div className="savebutton">
                    <ExportReactCSV csvData={savedPoint} />
                </div>
                }
                {newchart.map(({ x, y, selectedValuex, selectedValuey, selectedchart }, index) => (
                    <Chart key={uuid()} x={x} y={y} selectedValuex={selectedValuex}
                        selectedValuey={selectedValuey} selectedchart={selectedchart} deleteChart={() => deleteChart(index)} />
                ))}

            </div>
        </>
    );
}
export default Evaluation;


