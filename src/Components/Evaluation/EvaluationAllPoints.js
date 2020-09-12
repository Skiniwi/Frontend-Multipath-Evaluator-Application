import React, { useState, useEffect } from "react";
import "../../App.css";
import {
    Input, FormGroup, DropdownItem, Button, ButtonGroup,
    Navbar, Collapse, Spinner

} from 'reactstrap';
import uuid from 'react-uuid';
import Chart from "./Charts";
import * as turf from "@turf/turf";
function Evaluation(props) {
    //Split Down Button for Evaluation

    const options = { units: "meters" };
    const paths = []
    const [points, setPoints] = useState([]);
    const [id, setIdPoint] = useState(null);
    const [transmitter, setTransmitter] = useState([]);
    // const [savepoint, setSavedPoint] = useState([])
    const [final_keys, setFinal_Keys] = useState([]);
    const [selectedValuex, setSelectedValuex] = useState('Av_Power_Points')
    const [selectedValuey, setSelectedValuey] = useState('Av_Power_Points')
    const [returnn, setReturnn] = useState(false)
    const [selectedchart, setSelectedchart] = useState("CDF Chart")
    const [collapse, setCollapse] = useState(true);
    const [status, setStatus] = useState('Evaluation all Points ')
    let [newchart, setNewchart] = useState([])
    let [colorr, setColorr] = useState("")

    let calculatedcharts_all_points = {};
    const calculated_data_one_point_for_popup = []
    const calculated_Data_all_points_for_charts = [];

    useEffect(() => {
        if (!props.points) {
            return
        }
        setPoints(props.points);
        setIdPoint(props.idd);
        setTransmitter(props.tx);

    }, [props.points, props.idd, props.tx]);

    // this function select all points and calculate their data
    const distance_all_points = []
    const delaySpreadd = []
    // const aoaSpreadd = []
    const aoaSpreadd1 = []

    // const aodSpreadd = []
    const aodSpreadd1 = []
    const avg_delay_all_pointss = []
    const avg_power_all_pointss = []
    const avg_strength_all_pointss = []
    const mu0_aoa = []
    const mu0_aod = []
    const numberofpaths = []

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
        const aoa_by_st_one_point = [];
        const sq_aoa_by_strength_one_point = [];
        const aoa_array = [];
        const aod_by_st_one_point = [];
        const sq_aod_by_strength_one_point = [];
        const aod_array = [];
        numberofpaths.push(points[i].paths.length)

        for (let j = 0; j < points[i].paths.length; j++) {

            delay_arrayy.push(points[i].paths[j].delay / 1000);

            strength_array_one_point.push(points[i].paths[j].field_strength);
            //The Math.pow() function returns the base to the exponent power, that is, base ^exponent.
            sq_st_array_one_point.push(Math.pow(points[i].paths[j].field_strength, 2));

            power_array_mw_one_point.push(Math.pow(10, (points[i].paths[j].power / 10)));

            dl_by_st_one_point.push((points[i].paths[j].delay / 1000) * points[i].paths[j].field_strength);
            sq_delay_by_strength_one_point.push(Math.pow((points[i].paths[j].delay / 1000), 2) * points[i].paths[j].field_strength);

            if (points[i].paths[j].num_of_interactions > 0) {

                aoa_array.push(points[i].paths[j].interactions[0]['aoa']);

                aoa_by_st_one_point.push(points[i].paths[j].interactions[0]['aoa'] * points[i].paths[j].field_strength);

                sq_aoa_by_strength_one_point.push(Math.pow(points[i].paths[j].interactions[0]['aoa'], 2) * points[i].paths[j].field_strength);

                aod_array.push(points[i].paths[j].interactions[0]['aod']);
                aod_by_st_one_point.push(points[i].paths[j].interactions[0]['aod'] * points[i].paths[j].field_strength);
                sq_aod_by_strength_one_point.push(Math.pow(points[i].paths[j].interactions[0]['aod'], 2) * points[i].paths[j].field_strength);
                mu0_aoa.push(points[i].paths[j].interactions[0]['aoa'] - ((points[i].paths[j].interactions[0]['aoa'] * points[i].paths[j].field_strength) / strength_array_one_point.reduce((p, c) => c + p, 0)));
                mu0_aod.push(points[i].paths[j].interactions[0]['aod'] - ((points[i].paths[j].interactions[0]['aod'] * points[i].paths[j].field_strength) / strength_array_one_point.reduce((p, c) => c + p, 0)));

            }

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

        //calculate the delay spread
        const expectation_delay = dl_by_st_one_point.reduce((p, c) => c + p, 0) / strength_array_one_point.reduce((p, c) => c + p, 0);
        const expectation_delay_sq = sq_delay_by_strength_one_point.reduce((p, c) => c + p, 0) / strength_array_one_point.reduce((p, c) => c + p, 0);
        const delaySpread = Math.sqrt(expectation_delay_sq - Math.pow(expectation_delay, 2));

        //calculate the Angular spread

        const teta_mu_Aoa = (mu0_aoa[i] + 180) % 360 - 180

        // const teta_mu_Aoa = mu0_aoa[i] - 180
        const tetamu_sqrt_str_Aoa = Math.pow(teta_mu_Aoa, 2) * strength_array_one_point.reduce((previous, current) => current + previous, 0)
        const sigma_aoa = Math.sqrt(tetamu_sqrt_str_Aoa / sq_st_array_one_point.reduce((p, c) => c + p, 0))
        // console.log(sigma_aoa)

        const teta_mu_Aod = (mu0_aod[i] + 180) % 360 - 180
        const tetamu_sqrt_str_Aod = Math.pow(teta_mu_Aod, 2) * strength_array_one_point.reduce((previous, current) => current + previous, 0)
        const sigma_aod = Math.sqrt(tetamu_sqrt_str_Aod / sq_st_array_one_point.reduce((p, c) => c + p, 0))

        avg_power_all_pointss.push(avg_power_all_points)
        avg_delay_all_pointss.push(avg_delay_all_points)
        avg_strength_all_pointss.push(avg_strength_all_points)
        delaySpreadd.push(delaySpread)

        // aoaSpreadd.push(aoaSpread)
        aoaSpreadd1.push(sigma_aoa)

        // aodSpreadd.push(aodSpread)
        aodSpreadd1.push(sigma_aod)
        calculatedcharts_all_points = {
            Av_Power_Points: avg_power_all_pointss,
            Av_Strength_Points: avg_strength_all_pointss,
            Av_Delay_Points: avg_delay_all_pointss,
            Distance_Points: distance_all_points,
            DelaySpread_Points: delaySpreadd,
            AoA_Spread: aoaSpreadd1,
            AoD_Spread: aodSpreadd1,
            Number_of_Paths: numberofpaths,



        }
    }

    points.map(function (item) {
        if (id === item.point_id) {
            paths.push(item.paths)
        } return null
    })

    const calculated_Data_all_keys = []
    calculated_Data_all_points_for_charts.push(calculatedcharts_all_points)

    // set keys to display in dropdown button x and y
    const KeysFunction = event => {
        props.evaluationn(calculated_data_one_point_for_popup);
        calculated_Data_all_keys.push(Object.keys(calculated_Data_all_points_for_charts[0]))
        setFinal_Keys([...calculated_Data_all_keys[0]])
    }
    function handleChangex(event) { setSelectedValuex(event.target.value) }
    function handleChangey(event) { setSelectedValuey(event.target.value) }
    const x = []
    const y = []

    const clearStateAlert = () => setReturnn(false); if (returnn === true) { alert("Please select another option from the drop down !"); clearStateAlert() }
    function xFunction() {

        if (final_keys.includes(selectedValuex)) {
            const filteredd = calculated_Data_all_points_for_charts.filter(function (el) { return el !== null; })
            filteredd.forEach(function (j) { if (j[selectedValuex] !== undefined) { for (let i = 0; i < j[selectedValuex].length; i++) { x.push(j[selectedValuex][i]) } } })
        }
    }

    function yFunction() {
        if (final_keys.includes(selectedValuey)) {
            const filteredd = calculated_Data_all_points_for_charts.filter(function (el) { return el !== null; })
            filteredd.forEach(function (j) { if (j[selectedValuey] !== undefined) { for (let i = 0; i < j[selectedValuey].length; i++) { y.push(j[selectedValuey][i]) } } })
        }
    }
    function handleChangetypeofchart(event) { setSelectedchart(event.target.value) }

    const onOpening = () => setStatus(<Spinner size="sm" color="light" />);
    const onOpen = () => setStatus('Evaluation Window all Points');
    const onClosing = () => setStatus(<Spinner size="sm" color="light" />)
    const onClosed = () => setStatus('Click to Evaluate all Points');
    const toggle = () => setCollapse(!collapse);
    function createNewNewChart() {
        setColorr('blue')
        // setSavedPoint([...savepoint, ...save])
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
                <Collapse className="Collapse"

                    isOpen={collapse}
                    onEntering={onOpening}
                    onEntered={onOpen}
                    onExiting={onClosing}
                    onExited={onClosed}
                >
                    <div className="windowbutton" >
                        <ButtonGroup className="button" size="sm">
                            <FormGroup >
                                <DropdownItem header>
                                    <div className="headerdropdownitem" >Select type of chart </div >
                                </DropdownItem>
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
                                <DropdownItem header color="dark" ><div className="headerdropdownitem" > Select X Axis </div ></DropdownItem>
                                <Input color="dark" className="btn_in_window_evaluation" type="select" name='select' id="xSelect" defaultChecked
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
                                    <Input color="dark" className="btn_in_window_evaluation" type="select" name="select" id="ySelect" defaultChecked
                                        value={selectedValuey}
                                        onClick={KeysFunction}
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

                    </div>
                </Collapse>
            </div>

            <Collapse className="Collapse"

                isOpen={collapse}
                onEntering={onOpening}
                onEntered={onOpen}
                onExiting={onClosing}
                onExited={onClosed}
            >
                <div className="window">

                    {newchart.map(({ x, y, selectedValuex, selectedValuey, selectedchart }, index) => (
                        <Chart key={uuid()} x={x} y={y} selectedValuex={selectedValuex} colorr={colorr}
                            selectedValuey={selectedValuey} selectedchart={selectedchart} deleteChart={() => deleteChart(index)} />
                    ))}

                </div>
            </Collapse>

        </>
    );
}
export default Evaluation;


