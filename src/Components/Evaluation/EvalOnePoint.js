import React, { useState, useEffect } from "react";
import "../../App.css";
import {
    Input, FormGroup, DropdownItem, Button, ButtonGroup,
    Navbar, Collapse, Spinner

} from 'reactstrap';
import * as turf from "@turf/turf";
import { ExportReactCSV } from '../ExportCsv';
import Chart from "./Charts";
import uuid from 'react-uuid';

function OnePoint(props) {
    //Split Down Button for Evaluation
    const delay_array = [];
    const strength_array = [];
    const sq_st_ar = [];
    const dl_by_st = [];
    const sq_delay_by_strength = [];
    const sq_delay_by_power_array = [];
    const relative_delay = [];
    const relative_strength = [];
    const aoa_by_st = [];
    const sq_aoa_by_strength = [];
    const aoa_array = [];
    const aod_by_st = [];
    const sq_aod_by_strength = [];
    const aod_array = [];
    const pathloss = []
    const power_array = [];
    const power_array_mw = [];
    const path_distance = [];
    const los_distance = []
    const options = { units: "meters" };
    const paths = []
    const [points, setPoints] = useState([]);
    const [idd, setIdPoint] = useState(null);
    const [tx, setTransmitter] = useState([]);
    const [selectedPoint, setSelectedPoint] = useState(false)
    const [final_keys, setFinal_Keys] = useState([]);
    const [selectedValuex, setSelectedValuex] = useState('aoa')
    const [selectedValuey, setSelectedValuey] = useState('aoa')
    const [returnn, setReturnn] = useState(false)
    const [selectedchart, setSelectedchart] = useState("CDF Chart")
    const [status, setStatus] = useState('Select a Point to Evaluate ')
    const [collapse, setCollapse] = useState(true);
    const ASA = []
    const ASD = []
    const mu0_aoa = []
    const aoaSpreadd1 = []
    let [colorr1, setColorr1] = useState("");
    const polylines = []
    let calculatedcharts = {}
    let calculatedpopup = {}
    const calculated_data_one_point_for_popup = []
    const calculated_Data_one_point_for_charts = []
    const [calculatedall, setCalculatedall] = useState([]);
    const relative_power = []
    const relative_power_procent = []
    useEffect(() => {
        if (!props.points) {
            return
        }
        setPoints(props.points);
        setIdPoint(props.idd);
        setTransmitter(props.tx);

        if (props.idd !== null) {
            setSelectedPoint(true);
        }
        setCalculatedall(props.calculated_Data_all_points_for_charts)
    }, [props.points, props.idd, props.tx, props.calculated_Data_all_points_for_charts]);

    points.map(function (item) {
        if (idd === item.point_id) {
            paths.push(item.paths)
        } return null
    })
    // this function calculate  data for one point
    points.forEach(d => {
        if (idd === d.point_id) {
            const selectedPoint = [d.position.lat, d.position.lon]
            let polyline_0 = [selectedPoint, tx];
            const toPoly_0 = turf.lineString(polyline_0);
            const distancePoly_0 = turf.length(toPoly_0, options);
            los_distance.push(distancePoly_0);
            for (let i = 0; i < d.paths.length; i++) {

                if (d.paths[i].field_strength === "") {
                    delay_array.push(d.paths[i].delay / 1000);

                    strength_array.push(d.paths[i].PathLoss)
                    //The Math.pow() function returns the base to the exponent power, that is, base ^exponent.
                    sq_st_ar.push(Math.pow(d.paths[i].PathLoss, 2));
                    dl_by_st.push((d.paths[i].delay / 1000) * d.paths[i].PathLoss);
                    sq_delay_by_strength.push(Math.pow((d.paths[i].delay / 1000), 2) * d.paths[i].PathLoss);
                    power_array_mw.push(Math.pow(10, (d.paths[i].power / 10)));
                    power_array.push(d.paths[i].power);

                    if (d.paths[i].num_of_interactions > 0 && selectedPoint.length > 0) {
                        d.paths[i].interactions.forEach(j => {
                            const polyline = [selectedPoint, [j.position.lat, j.position.lon], tx];
                            polylines.push(polyline);
                            const toPoly = turf.lineString(polyline);
                            const distancePoly = turf.length(toPoly, options);
                            path_distance.push(Math.floor(distancePoly));
                        });
                        aoa_array.push(d.paths[i].interactions[0]['aoa']);
                        aoa_by_st.push(d.paths[i].interactions[0]['aoa'] * d.paths[i].PathLoss);
                        sq_aoa_by_strength.push(Math.pow(d.paths[i].interactions[0]['aoa'], 2) * d.paths[i].PathLoss);

                        aod_array.push(d.paths[i].interactions[0]['aod']);
                        aod_by_st.push(d.paths[i].interactions[0]['aod'] * d.paths[i].PathLoss);
                        sq_aod_by_strength.push(Math.pow(d.paths[i].interactions[0]['aod'], 2) * d.paths[i].PathLoss);
                    }
                    else {
                        const selectedPoint = [d.position.lat, d.position.lon]
                        let polyline_0 = [selectedPoint, tx];
                        const toPoly_0 = turf.lineString(polyline_0);
                        const distancePoly_0 = turf.length(toPoly_0, options);
                        path_distance.push(distancePoly_0);

                    }
                }
                else {
                    delay_array.push(d.paths[i].delay / 1000);
                    strength_array.push(d.paths[i].field_strength);
                    //The Math.pow() function returns the base to the exponent power, that is, base ^exponent.
                    sq_st_ar.push(Math.pow(d.paths[i].field_strength, 2));
                    dl_by_st.push((d.paths[i].delay / 1000) * d.paths[i].field_strength);
                    sq_delay_by_strength.push(Math.pow((d.paths[i].delay / 1000), 2) * d.paths[i].field_strength);
                    sq_delay_by_power_array.push(Math.pow((d.paths[i].delay / 1000), 2) * d.paths[i].power);
                    power_array_mw.push(Math.pow(10, (d.paths[i].power / 10)));
                    power_array.push(d.paths[i].power);
                    pathloss.push(d.paths[i].PathLoss)
                }
                if (d.paths[i].num_of_interactions > 0 && selectedPoint.length > 0) {
                    d.paths[i].interactions.forEach(j => {
                        const polyline = [selectedPoint, [j.position.lat, j.position.lon], tx];
                        polylines.push(polyline);
                        const toPoly = turf.lineString(polyline);
                        const distancePoly = turf.length(toPoly, options);
                        path_distance.push(Math.floor(distancePoly));
                    });
                    aoa_array.push(d.paths[i].interactions[0]['aoa']);
                    aoa_by_st.push(d.paths[i].interactions[0]['aoa'] * d.paths[i].field_strength);
                    sq_aoa_by_strength.push(Math.pow(d.paths[i].interactions[0]['aoa'], 2) * d.paths[i].field_strength);
                    mu0_aoa.push(d.paths[i].interactions[0]['aoa'] - ((d.paths[i].interactions[0]['aoa'] * d.paths[i].field_strength) / strength_array.reduce((p, c) => c + p, 0)));
                    aod_array.push(d.paths[i].interactions[0]['aod']);
                    aod_by_st.push(d.paths[i].interactions[0]['aod'] * d.paths[i].field_strength);
                    sq_aod_by_strength.push(Math.pow(d.paths[i].interactions[0]['aod'], 2) * d.paths[i].field_strength);
                }
                else {
                    const selectedPoint = [d.position.lat, d.position.lon]
                    let polyline_0 = [selectedPoint, tx];
                    const toPoly_0 = turf.lineString(polyline_0);
                    const distancePoly_0 = turf.length(toPoly_0, options);
                    path_distance.push(distancePoly_0);

                }
                //The Math.sqrt() function returns the square root of a number//
                //The reduce() method executes a reducer function (that you provide) on each element of the array, resulting in single output value. //
                //Calculate delay and average of delay:
                const sum_delay = delay_array.reduce((previous, current) => current + previous, 0);
                const avg_delay = sum_delay / delay_array.length;
                relative_delay.push(delay_array[i] / sum_delay)
                //Calculate power and average of power:
                const sum_power = power_array_mw.reduce((previous, current) => current + previous, 0);
                const avg_power = 10 * Math.log10(sum_power / power_array_mw.length);
                relative_power.push(power_array_mw[i] / sum_power)
                relative_power_procent.push(Math.floor((power_array_mw[i] / sum_power) * 100));
                console.log(relative_power_procent[i])
                //calculate the delay spread
                const expectation_delay = dl_by_st.reduce((previous, current) => current + previous, 0) / power_array.reduce((previous, current) => current + previous, 0);
                const expectation_delay_sq = sq_delay_by_power_array.reduce((previous, current) => current + previous, 0) / power_array.reduce((previous, current) => current + previous, 0);
                const delaySpread = Math.sqrt(expectation_delay_sq - Math.pow(expectation_delay, 2));

                const expectation_delay1 = dl_by_st.reduce((previous, current) => current + previous, 0) / strength_array.reduce((previous, current) => current + previous, 0);
                const expectation_delay_sq1 = sq_delay_by_strength.reduce((previous, current) => current + previous, 0) / strength_array.reduce((previous, current) => current + previous, 0);
                const delaySpread1 = Math.sqrt(expectation_delay_sq1 - Math.pow(expectation_delay1, 2));

                //Calculate strength and average of strength:
                const sum_strength = strength_array.reduce((previous, current) => current + previous, 0);
                const avg_strength = sum_strength / strength_array.length;
                relative_strength.push(strength_array[i] / sum_strength)

                //calculate the Angular spread
                const teta_mu_Aoa = (mu0_aoa[i] + 180) % 360 - 180
                const tetamu_sqrt_str_Aoa = Math.pow(teta_mu_Aoa, 2) * d.paths[i].field_strength
                const sigma_aoa = Math.sqrt(tetamu_sqrt_str_Aoa / sum_strength)
                aoaSpreadd1.push(sigma_aoa)

                calculatedcharts = {
                    Paths_Power: power_array,
                    Paths_Strength: strength_array,
                    Paths_Delay: delay_array,
                    Paths_Distance: path_distance,
                    PathLoss: pathloss,
                }
                calculatedpopup = {
                    iddd: idd,
                    avg_delay: avg_delay,
                    avg_power: avg_power,
                    avg_strength: avg_strength,
                    delaySpread: delaySpread1,
                    delaySpread1: delaySpread,
                    aoaSpread: ASA,
                    aodSpread: ASD,
                    path_distance: los_distance,

                }
            }
        }
        calculated_Data_one_point_for_charts.push(calculatedcharts);
        calculated_data_one_point_for_popup.push(calculatedpopup);
    });

    const save = []
    const savepoint = [...save]

    let savePopup = calculated_data_one_point_for_popup.filter(value => Object.keys(value).length !== 0)
    let saveChart = calculated_Data_one_point_for_charts.filter(value => Object.keys(value).length !== 0)
    // let saveall = calculatedall.filter(value => Object.keys(value).length !== 0)
    // , saveall[0]
    save.push(savePopup[0], saveChart[0])
    const savedPoint = [...savepoint]


    let calculated_Data_one_keys = []
    let calculated_path_keys = []
    const path_Data_one_keys = []
    const calculatedarraykeys = []
    calculated_Data_one_point_for_charts.forEach((item) => { calculatedarraykeys.push(Object.keys(item)); })
    // set keys to display in dropdown button x and y
    paths.forEach(item => { item.forEach(path => { path.interactions.forEach(j => { path_Data_one_keys.push(Object.keys(j)) }) }); });
    const KeysFunction = event => {
        props.evaluationn(calculated_data_one_point_for_popup);
        for (let i = 0; i < calculatedarraykeys.length; i++) { if (calculatedarraykeys[i].length > 0) { calculated_Data_one_keys = calculatedarraykeys[i] } }
        for (let i = 0; i < path_Data_one_keys.length; i++) { calculated_path_keys = path_Data_one_keys[i] }
        setFinal_Keys([...calculated_path_keys, ...calculated_Data_one_keys])
    }

    function handleChangex(event) { setSelectedValuex(event.target.value) }
    function handleChangey(event) { setSelectedValuey(event.target.value) }
    const x = []
    const y = []


    const ignorekeys = ["position", "material_id", "interaction_type", "interactions", "interacted_obj_id", "num_of_interactions", "type_of_path"]
    const clearStateAlert = () => setReturnn(false); if (returnn === true) { alert("Please select another option from the drop down !"); clearStateAlert() }
    const returnnn = () => { setReturnn(true); return }
    function xFunction() {
        if (final_keys.includes(selectedValuex)) {
            const filtered = calculated_Data_one_point_for_charts.filter(function (el) { return el !== null; })
            filtered.forEach(function (j) { if (j[selectedValuex] !== undefined) { for (let i = 0; i < j[selectedValuex].length; i++) { x.push(j[selectedValuex][i]) } } })
        }

        paths.forEach(function (item) {
            item.forEach(function (path) {
                if (final_keys.includes(selectedValuex)) {
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
        }
        paths.forEach(function (item) {
            item.forEach(function (path) {
                if (final_keys.includes(selectedValuey)) {
                    path.interactions.forEach(j => {
                        y.push(j[selectedValuey])
                        if (ignorekeys.includes(selectedValuey)) { returnnn() }
                    });
                }
                if (ignorekeys.includes(selectedValuey)) { returnnn() }
            });
        });
    }

    function handleChangetypeofchart(event) { setSelectedchart(event.target.value) }
    let [newchart1, setNewchart1] = useState([])


    function createNewNewChart1() {
        setColorr1('yellow');
        // setSavedPoint([...savepoint, ...save])
        setNewchart1(p => [...p, {
            selectedchart,
            x,
            y,
            selectedValuex,
            selectedValuey,

        }]);
    }

    const deleteChart = (index) => {
        const copyNewchart1 = Object.assign([], newchart1);
        copyNewchart1.splice(index, 1);
        setNewchart1(newchart1 = copyNewchart1)
    };
    const onOpening = () => setStatus(<Spinner size="sm" color="light" />);
    const onOpen = () => setStatus('Evaluation Window Selected Point');
    const onClosing = () => setStatus(<Spinner size="sm" color="light" />)
    const onClosed = () => setStatus('Click to Evaluate One Point');
    const toggle = () => setCollapse(!collapse);
    return (
        <>
            <div id={uuid()} className="openandclosebuttonnav1">
                <Navbar className="nav_button" expand="sm">
                    <div className="headernav1" > {status}</div>
                    <Button className="btn_in_nav_button1" size="sm" dark="true" onClick={toggle} >
                        {collapse ? onClosed && <i className="arrow up"></i> : <i className="arrow down"></i>}
                    </Button>
                </Navbar>
                <Collapse className="Collapse"

                    isOpen={collapse}
                    onEntering={onOpening}
                    onEntered={onOpen}
                    onExiting={onClosing}
                    onExited={onClosed}
                >
                    <div className="windowbutton1" >

                        <ButtonGroup className="button1" size="sm">
                            <FormGroup >
                                <DropdownItem header> <div className="headerdropdownitem" >Select type of chart </div > </DropdownItem>
                                <Input color="dark" className="btn_in_window_evaluation" type="select" name="select" idd="selectchart" defaultChecked
                                    value={selectedchart} onChange={handleChangetypeofchart} >
                                    <option color="dark" >CDF Chart</option>
                                    <option color="dark"  >C-CDF Chart</option>
                                    <option color="dark"  >Scatter Chart</option>

                                </Input>
                            </FormGroup>
                        </ButtonGroup>

                        <ButtonGroup className="buttonx" size="sm">
                            <FormGroup >
                                <DropdownItem header color="dark" ><div className="headerdropdownitem" > Select X Axis </div ></DropdownItem>
                                <Input color="dark" className="btn_in_window_evaluation" type="select" name='select' idd="xSelect" defaultChecked
                                    value={selectedValuex}
                                    onClick={KeysFunction}
                                    onChange={handleChangex}
                                    placeholder="Check it out"  >
                                    {final_keys.length > 0 ? final_keys.map((item1, index1) => <option color="dark" key={index1} >{item1}</option>) : <option color="dark"  >Double Click</option>}

                                </Input>

                            </FormGroup>

                            {selectedchart === "Scatter Chart" ?
                                < FormGroup >
                                    <DropdownItem header color="dark"><div className="headerdropdownitem" >Select Y Axis </div > </DropdownItem>
                                    <Input color="dark" className="btn_in_window_evaluation" type="select" name="select" idd="ySelect" defaultChecked
                                        value={selectedValuey}
                                        onClick={KeysFunction}
                                        onChange={handleChangey} >
                                        {final_keys.length > 0 && final_keys.map((item, index) => <option color="dark" key={index} >{item}</option>)}
                                    </Input>
                                </FormGroup> : ''}
                        </ButtonGroup>

                        {<ButtonGroup className="buttonevaluation" size="sm">
                            <FormGroup>
                                <Button onClick={() => {
                                    yFunction(); xFunction(); createNewNewChart1()
                                }} >Start Evaluation</Button>
                            </FormGroup>
                        </ButtonGroup>}
                    </div>

                    {selectedPoint && calculatedall &&
                        <div className="savebutton">
                            <ExportReactCSV csvData={[...savedPoint]} />
                        </div>
                    }

                </Collapse>
            </div>
            <Collapse className="Collapse"

                isOpen={collapse}
                onEntering={onOpening}
                onEntered={onOpen}
                onExiting={onClosing}
                onExited={onClosed}
            >
                <div className="window1">
                    {newchart1.map(({ x, y, selectedValuex, selectedValuey, selectedchart }, index) => (
                        <Chart key={uuid()} x={x} y={y} selectedValuex={selectedValuex} colorr1={colorr1}
                            selectedValuey={selectedValuey} selectedchart={selectedchart} deleteChart={() => deleteChart(index)} />))}
                </div>
            </Collapse>

        </>
    );
}
export default OnePoint;