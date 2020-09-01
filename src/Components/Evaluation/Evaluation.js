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
    const delay_array = [];
    const strength_array = [];
    const sq_st_ar = [];
    const dl_by_st = [];
    const sq_delay_by_strength = [];
    const power_array = [];
    const power_array_mw = [];
    const path_distance = [];
    const los_distance = []
    const options = { units: "meters" };
    const paths = []
    const [points, setPoints] = useState([]);
    const [id, setIdPoint] = useState(null);
    const [transmitter, setTransmitter] = useState([]);
    const polylines = []

    let calculatedcharts = {}
    let calculatedpopup = {}
    const calculated_data_one_point_for_popup = []
    const calculated_Data_one_point_for_charts = []


    useEffect(() => {
        if (!props.points) {
            return
        }
        setPoints(props.points);
        setIdPoint(props.idd);
        setTransmitter(props.tx);
    }, [props.points, props.idd, props.tx]);




    const calculated_Data_all_points_for_charts = [];
    let calculatedcharts_all_points = {};
    // this function select all points and calculate their data
    function select_all_points() {
        console.log('select all points clicked')
        const distance_all_points = []
        const delaySpreadd = []
        const avg_delay_all_pointss = []
        const avg_power_all_pointss = []
        const avg_strength_all_pointss = []

        for (let i = 0; i < points.length; i++) {
            let los = [[points[i].position.lat, points[i].position.lon], transmitter];
            const toLos = turf.lineString(los);
            const distance = turf.length(toLos, options);
            distance_all_points.push(distance);
            const delay_arrayy = []
            const strength_array_one_point = []
            const dl_by_st_one_point = []
            const sq_delay_by_strength_one_point = []
            const power_array_mw_one_point = []
            const sq_st_array_one_point = []
            for (let j = 0; j < points[i].paths.length; j++) {
                delay_arrayy.push(points[i].paths[j].delay);

                strength_array_one_point.push(points[i].paths[j].field_strength);
                //The Math.pow() function returns the base to the exponent power, that is, base ^exponent.
                sq_st_array_one_point.push(Math.pow(points[i].paths[j].field_strength, 2));

                power_array_mw_one_point.push(Math.pow(10, (points[i].paths[j].power / 10)));

                dl_by_st_one_point.push(points[i].paths[j].delay * points[i].paths[j].field_strength);
                sq_delay_by_strength_one_point.push(Math.pow(points[i].paths[j].delay, 2) * points[i].paths[j].field_strength);
            }
            //Calculate  delay power of all points:
            const sum_delay_all_points = delay_arrayy.reduce((p, c) => c + p, 0);
            const avg_delay_all_points = sum_delay_all_points / delay_arrayy.length;

            //Calculate  average power of all points:
            const sum_power_all_points = power_array_mw_one_point.reduce((p, c) => c + p, 0);
            const avg_power_all_points = 10 * Math.log10(sum_power_all_points / power_array_mw_one_point.length);

            //Calculate  average strength of all points:
            const sum_strength_all_points = sq_st_array_one_point.reduce((p, c) => c + p, 0);
            const avg_strength_all_points = Math.sqrt(sum_strength_all_points / strength_array_one_point.length);

            // const n_avg_str_all_points = parseInt(avg_strength_all_points, 10);
            // avg_strength_array.push(n_avg_str_all_points);

            //calculate the delay spread
            const expectation_delay = dl_by_st_one_point.reduce((p, c) => c + p, 0) / strength_array_one_point.reduce((p, c) => c + p, 0);
            const expectation_delay_sq = sq_delay_by_strength_one_point.reduce((p, c) => c + p, 0) / strength_array_one_point.reduce((p, c) => c + p, 0);
            const delaySpread = Math.sqrt(expectation_delay_sq - Math.pow(expectation_delay, 2));

            avg_power_all_pointss.push(avg_power_all_points)
            avg_delay_all_pointss.push(avg_delay_all_points)
            avg_strength_all_pointss.push(avg_strength_all_points)
            delaySpreadd.push(delaySpread)
            calculatedcharts_all_points = {
                Av_Power_Points: avg_power_all_pointss,
                Av_Strength_Points: avg_strength_all_pointss,
                Av_Delay_Points: avg_delay_all_pointss,
                DelaySpread_Points: delaySpreadd,
                Distance_Points: distance_all_points
            }


            // console.log('delayspread', calculatedcharts_all_points.delaySpread, 'strength', calculatedcharts_all_points.Av_Strength_Points, 'power', calculatedcharts_all_points.Av_Power_Points, 'delay', calculatedcharts_all_points.avg_delay_all_points, 'Distance', distance_all_points[i])
            calculated_Data_all_points_for_charts.push(calculatedcharts_all_points)
        }
    }



    console.log(calculated_Data_all_points_for_charts)


    points.map(function (item) {
        if (id === item.point_id) {
            paths.push(item.paths)
        } return null
    })

    // this function calculate  data for one point
    points.forEach(d => {
        if (id === d.point_id) {
            const selectedPoint = [d.position.lat, d.position.lon]
            let polyline_0 = [selectedPoint, transmitter];
            const toPoly_0 = turf.lineString(polyline_0);
            const distancePoly_0 = turf.length(toPoly_0, options);
            los_distance.push(distancePoly_0);

            for (let i = 0; i < d.paths.length; i++) {
                delay_array.push(d.paths[i].delay);
                strength_array.push(d.paths[i].field_strength);
                //The Math.pow() function returns the base to the exponent power, that is, base ^exponent.
                sq_st_ar.push(Math.pow(d.paths[i].field_strength, 2));
                dl_by_st.push(d.paths[i].delay * d.paths[i].field_strength);
                sq_delay_by_strength.push(Math.pow(d.paths[i].delay, 2) * d.paths[i].field_strength);
                power_array_mw.push(Math.pow(10, (d.paths[i].power / 10)));
                power_array.push(d.paths[i].power);

                if (d.paths[i].num_of_interactions > 0 && selectedPoint.length > 0) {
                    d.paths[i].interactions.forEach(j => {
                        const polyline = [selectedPoint, [j.position.lat, j.position.lon], transmitter];
                        polylines.push(polyline);
                        const toPoly = turf.lineString(polyline);
                        const distancePoly = turf.length(toPoly, options);
                        path_distance.push(Math.floor(distancePoly));

                    });
                }
                else {
                    const selectedPoint = [d.position.lat, d.position.lon]
                    let polyline_0 = [selectedPoint, transmitter];
                    const toPoly_0 = turf.lineString(polyline_0);
                    const distancePoly_0 = turf.length(toPoly_0, options);
                    path_distance.push(distancePoly_0);

                }

                // if (d.paths[i].num_of_interactions > 0 && selectedPoint.length > 0) {
                //     d.paths[i].interactions.forEach(j => {
                //         path_pos_array.push([j.position.lat, j.position.lon]);
                //         let polyline = [selectedPoint, [j.position.lat, j.position.lon], transmitter];
                //         polylines.push(polyline);
                //         const toPoly = turf.lineString(polyline);
                //         const distancePoly = turf.length(toPoly, options);
                //         distance_array_poly.push(Math.floor(distancePoly));
                //     });
                // }
                // const c = Math.pow((2.9979 * Math.pow(10, 8)), 2);

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

                //calculate the delay spread
                const expectation_delay = dl_by_st.reduce((previous, current) => current + previous, 0) / strength_array.reduce((previous, current) => current + previous, 0);
                const expectation_delay_sq = sq_delay_by_strength.reduce((previous, current) => current + previous, 0) / strength_array.reduce((previous, current) => current + previous, 0);
                const delaySpread = Math.sqrt(expectation_delay_sq - Math.pow(expectation_delay, 2));
                calculatedcharts = {
                    Paths_Power: power_array,
                    Paths_Strength: strength_array,
                    Paths_Delay: delay_array,
                    Paths_Distance: path_distance,
                }
                calculatedpopup = {
                    iddd: id,
                    avg_delay: avg_delay,
                    avg_power: avg_power,
                    avg_strength: avg_strength,
                    delaySpread: delaySpread,
                    path_distance: los_distance,
                }
            }

        }
        calculated_Data_one_point_for_charts.push(calculatedcharts);
        calculated_data_one_point_for_popup.push(calculatedpopup);

    });


    // console.log(calculated_Data_one_point_for_charts)

    const [savepoint, setSavedPoint] = useState([]);
    const savedPoint = [...savepoint]
    const save = []
    const saveData = calculated_data_one_point_for_popup.filter(value => Object.keys(value).length !== 0);
    if (saveData !== undefined) {
        save.push(saveData[0])
    }


    // set keys to display in dropdown button x and y
    const [keyCalculatedAllPoints, setkeyCalculatedAllPoints] = useState([]);
    const [keypath, setKeypath] = useState([]);
    const [keyCalculatedData, setkeyCalculatedData] = useState([]);
    const [final_keys, setKey] = useState([]);




    function KeysFunction() {
        calculated_Data_all_points_for_charts.forEach(j => { setkeyCalculatedAllPoints(Object.keys(j)) });
        paths.forEach(function (item) { item.forEach(function (path) { path.interactions.forEach(j => { setKeypath(Object.keys(j)) }) }); });
        calculated_Data_one_point_for_charts.forEach(j => { setkeyCalculatedData(Object.keys(j)) });

        setKey([...keyCalculatedAllPoints, ...keypath, ...keyCalculatedData])
        props.evaluationn(calculated_data_one_point_for_popup);
    }


    const [selectedValuex, setSelectedValuex] = useState('Av_Power_Points')
    const [selectedValuey, setSelectedValuey] = useState('Av_Power_Points')
    function handleChangex(event) { setSelectedValuex(event.target.value) }
    function handleChangey(event) { setSelectedValuey(event.target.value) }
    const x = []
    const y = []
    const [returnn, setReturnn] = useState(false)
    const ignorekeys = ["position", "material_id", "interaction_type", "interactions", "interacted_obj_id", "num_of_interactions", "type_of_path"]
    const clearStateAlert = () => setReturnn(false); if (returnn === true) { alert("Please select another option from the drop down !"); clearStateAlert() }
    const returnnn = () => { setReturnn(true); return }
    function xFunction() {
        if (final_keys.includes(selectedValuex)) {
            const filtered = calculated_Data_one_point_for_charts.filter(function (el) { return el !== null; })
            filtered.forEach(function (j) { if (j[selectedValuex] !== undefined) { for (let i = 0; i < j[selectedValuex].length; i++) { x.push(j[selectedValuex][i]) } } })
            const filteredd = calculated_Data_all_points_for_charts.filter(function (el) { return el !== null; })
            filteredd.forEach(function (j) { if (j[selectedValuex] !== undefined) { for (let i = 0; i < j[selectedValuex].length; i++) { x.push(j[selectedValuex][i]) } } })
        }

        paths.forEach(function (item) {
            item.forEach(function (path) {
                if (keypath.includes(selectedValuex)) {
                    path.interactions.forEach(j => {
                        x.push(j[selectedValuex])
                        if (ignorekeys.includes(selectedValuex)) { returnnn() }
                    });
                }
                if (ignorekeys.includes(selectedValuex)) { returnnn() }
            });
        });
    }

    function yFunction() {
        if (final_keys.includes(selectedValuey)) {
            const filtered = calculated_Data_one_point_for_charts.filter(function (el) { return el !== null; })
            filtered.forEach(function (j) { if (j[selectedValuey] !== undefined) { for (let i = 0; i < j[selectedValuey].length; i++) { y.push(j[selectedValuey][i]) } } })
            const filteredd = calculated_Data_all_points_for_charts.filter(function (el) { return el !== null; })
            filteredd.forEach(function (j) { if (j[selectedValuex] !== undefined) { for (let i = 0; i < j[selectedValuex].length; i++) { y.push(j[selectedValuex][i]) } } })
        }

        paths.forEach(function (item) {
            item.forEach(function (path) {
                if (keypath.includes(selectedValuey)) {
                    path.interactions.forEach(j => {
                        y.push(j[selectedValuey])
                        if (ignorekeys.includes(selectedValuey)) { returnnn() }
                    });
                }
                if (ignorekeys.includes(selectedValuey)) { returnnn() }
            });
        });
    }
    const [selectedchart, setSelectedchart] = useState("CDF Chart")
    function handleChangetypeofchart(event) { setSelectedchart(event.target.value) }
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
                    <div className="headernav1" > {status}</div>
                    <Button className="btn_in_nav_button1" size="sm" dark="true" onClick={toggle} >
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
                            <FormGroup >
                                <DropdownItem header> <div className="headerdropdownitem" >Select type of chart </div > </DropdownItem>
                                <Input color="dark" className="btn_in_window_evaluation" type="select" name="select" id="selectchart" defaultChecked
                                    value={selectedchart} onChange={handleChangetypeofchart} >
                                    <option color="dark" >CDF Chart</option>
                                    <option color="dark"  >C-CDF Chart</option>
                                    <option color="dark"  >Scatter Chart</option>

                                </Input>
                            </FormGroup>
                        </ButtonGroup>

                        <ButtonGroup className="buttonx" size="sm">
                            <FormGroup >
                                <DropdownItem header color="dark" ><div className="headerdropdownitem" >Select X Axis </div ></DropdownItem>
                                <Input color="dark" className="btn_in_window_evaluation" type="select" name='select' id="xSelect" defaultChecked
                                    value={selectedValuex}
                                    onClick={() => { select_all_points(); KeysFunction() }}
                                    onChange={handleChangex} >
                                    {final_keys.length > 0 && final_keys.map((item1, index1) => <option color="dark" key={index1} >{item1}</option>)}
                                </Input>
                            </FormGroup>

                            {selectedchart === "Scatter Chart" ?
                                < FormGroup >
                                    <DropdownItem header color="dark"><div className="headerdropdownitem" >Select Y Axis </div > </DropdownItem>
                                    <Input color="dark" className="btn_in_window_evaluation" type="select" name="select" id="ySelect" defaultChecked
                                        value={selectedValuey}
                                        onClick={() => { select_all_points(); KeysFunction() }}
                                        onChange={handleChangey} >
                                        {final_keys.length > 0 && final_keys.map((item, index) => <option color="dark" key={index} >{item}</option>)}
                                    </Input>
                                </FormGroup> : ''}
                        </ButtonGroup>

                        {<ButtonGroup className="buttonevaluation" size="sm">
                            <FormGroup>
                                <Button onClick={() => { xFunction(); yFunction(); createNewNewChart() }} >Start Evaluation</Button>
                            </FormGroup>
                        </ButtonGroup>}


                        <FormGroup className="selectallpoints" size="sm">
                            <Button onClick={select_all_points}>Select all Points</Button>
                        </FormGroup>

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


