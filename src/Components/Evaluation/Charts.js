import {
    Button,
    Navbar, Collapse, Spinner
} from 'reactstrap';
import React, { useEffect, useState } from "react";
import cdf from 'cumulative-distribution-function';
import {
    ScatterChart, Scatter, XAxis, YAxis, CartesianGrid,
    ResponsiveContainer, Tooltip, LineChart, Line
} from 'recharts';
import "../../App.css";
import uuid from 'react-uuid';

function Chart(props) {
    const [dCdf, setDCdf] = useState([])
    const [dCCdf, setDCCdf] = useState([])
    const [d, setD] = useState([])
    const [y, setYarray] = useState([])
    const [x, setXarray] = useState([])
    const [namey, setNamey] = useState("")
    const [dataKey, setDataKey] = useState("")
    const [valuey, setValuey] = useState("")
    const [namescatterr, setNamescatterr] = useState("")
    const [datachart, setDatachart] = useState([])
    const [domain, setDomain] = useState()
    const [selectedchart, setSelectedchart] = useState('')
    const [namescatter, setNameScatter] = useState('')
    const [nameScatterCdf, setNameScatterCdf] = useState('')
    const [nameScatterCCdf, setNameScatterCCdf] = useState('')
    const [selectedValuex, setSelectedValuex] = useState('')
    const [selectedValuey, setSelectedValuey] = useState('')
    const [collapse, setCollapse] = useState(true);
    const [status, setStatus] = useState(namescatterr);
    const [colorr, setColor] = useState("")
    const [colorr1, setColor1] = useState("")
    useEffect(() => {
        if (selectedchart === "Scatter Chart") {
            setDataKey("y");
            setNamey(selectedValuey);
            setValuey(selectedValuey);
            setNamescatterr(namescatter);
            setDatachart(d)
        }
        else if (selectedchart === "CDF Chart") {
            setDataKey("CDF");
            setNamey("CDF");
            setValuey("CDF");
            setNamescatterr(nameScatterCdf);
            setDatachart(dCdf);
            setDomain([0, 1])
        }
        else if (selectedchart === "C-CDF Chart") {
            setDataKey("C-CDF");
            setNamey("C-CDF");
            setValuey("C-CDF");
            setNamescatterr(nameScatterCCdf);
            setDatachart(dCCdf);
            setDomain([0, 1])
        }

    }, [selectedchart, selectedValuey, namescatter, d, nameScatterCdf, dCdf, nameScatterCCdf, dCCdf])

    useEffect(() => {
        const arrayChart = [];
        for (let i = 0; i < x.length; i++) {
            arrayChart.push({ 'x': x[i], 'y': y[i] })
            setD(arrayChart)
        }
    }, [x, y])
    useEffect(() => {
        const mycdf = cdf(x);
        const cdfx = mycdf.xs()
        const cdfy = mycdf.ps()
        const array = cdfx.map((v, i) => ({ 'x': v, 'CDF': cdfy[i] }));
        setDCdf(array)
    }, [x])
    useEffect(() => {
        const myccdf = cdf(x);
        const ccdfx = myccdf.xs()
        const ccdfy = myccdf.ps()
        const arrayc = ccdfx.map((v, i) => ({ 'x': v, 'C-CDF': 1 - ccdfy[i] }));
        setDCCdf(arrayc)
    }, [x])

    useEffect(() => {
        if (!props.x) {
            return
        };
        setXarray(props.x);
        setYarray(props.y);
        setSelectedchart(props.selectedchart)
        setColor1(props.colorr1)
        setColor(props.colorr)
        if (!props.selectedValuex) {
            return
        };
        // to make capital letters in x axis in the chart
        if (Object.keys(props.selectedValuex).length > 3) {
            setSelectedValuex(
                props.selectedValuex.slice(0, 1).toUpperCase() +
                props.selectedValuex.slice(1, props.selectedValuex.length)
            );
        }
        else if (Object.keys(props.selectedValuex).length === 3) {
            setSelectedValuex(
                props.selectedValuex.slice(0, 1).toUpperCase() +
                props.selectedValuex.slice(1, 2) +
                props.selectedValuex.slice(2).toUpperCase()
            );
        }
        setSelectedValuey(props.selectedValuey.slice(0, 1).toUpperCase() +
            props.selectedValuey.slice(1, props.selectedValuey.length));

        setNameScatter(props.selectedValuex.slice(0, 1).toUpperCase() +
            props.selectedValuex.slice(1, props.selectedValuex.length)
            + '/' + props.selectedValuey.slice(0, 1).toUpperCase() +
            props.selectedValuey.slice(1, props.selectedValuey.length))

        setNameScatterCdf(props.selectedValuex.slice(0, 1).toUpperCase() +
            props.selectedValuex.slice(1, props.selectedValuex.length) + '/CDF')

        setNameScatterCCdf(props.selectedValuex.slice(0, 1).toUpperCase() +
            props.selectedValuex.slice(1, props.selectedValuex.length) + '/C-CDF')
    }, [props.x, props.y, props.selectedValuex, props.selectedValuey, props.selectedchart, props.colorr, props.colorr1]);

    const onEntering = () => setStatus(<Spinner size="sm" color="light" />);
    const onEntered = () => setStatus(namescatterr);
    const onExiting = () => setStatus(<Spinner size="sm" color="light" />)
    const onExited = () => setStatus(namescatterr);
    const toggle = () => setCollapse(!collapse);
    const deleteChart = () => props.deleteChart(props.index)
    let colo = ''
    if (colorr1 !== undefined) { colo = colorr1 }
    if (colorr !== undefined) { colo = colorr }
    return (
        <>

            <div id={uuid()} className="openandclosechart">
                <Navbar className="nav" expand="sm">
                    <h5>{status}</h5>
                    <Button className="btn_in_nav_chart" size="sm" dark="true" onClick={toggle} >
                        {collapse ? onExited && <i className="arrow up"></i> : <i className="arrow down"></i>}
                    </Button>
                    <Button className="trash_btn" size="sm" dark="true"
                        onClick={() => deleteChart()} >
                        <i className="fa fa-trash"></i>
                    </Button>
                </Navbar>
                <Collapse
                    isOpen={collapse}
                    onEntering={onEntering}
                    onEntered={onEntered}
                    onExiting={onExiting}
                    onExited={onExited}
                >
                    <div className="chart">
                        {(dataKey !== 'y') &&
                            <ResponsiveContainer >
                                <LineChart
                                    width={450}
                                    height={400}
                                    data={datachart}
                                    name={namey}
                                    margin={{
                                        top: 20, right: 20, bottom: 30, left: 20,
                                    }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis
                                        type="number"
                                        dataKey={'x'}
                                        style={{ fontSize: '0.8rem', fontFamily: 'Arial' }}
                                        stroke="white" axisLine={false}
                                        tickLine={false}
                                        label={{
                                            fontSize: '1.5rem', fontFamily: 'Arial', fill: '#ffffff',
                                            value: selectedValuex, position: 'insideBottom', offset: -12
                                        }}
                                    />
                                    <YAxis
                                        type="number"
                                        dataKey={namey}
                                        style={{ fontSize: '0.8rem', fontFamily: 'Arial' }}
                                        stroke="white" axisLine={false}
                                        tickLine={false}
                                        tickCount={20}
                                        domain={domain}
                                        label={{
                                            fontSize: '1.5rem', fontFamily: 'Arial', fill: '#ffffff',
                                            value: valuey, angle: -90, position: 'left', dy: -70
                                        }} />

                                    <Tooltip wrapperStyle={{ width: 'auto', color: "#000000" }} cursor={{ strokeDasharray: '3 3' }} />
                                    <Line dataKey={dataKey}
                                        dot={false}
                                        activeShape={false} type="monotone" activeDot={{ r: 3 }} stroke={colo} />
                                </LineChart>
                            </ResponsiveContainer >}

                        {dataKey === 'y' &&
                            <ResponsiveContainer >
                                < ScatterChart
                                    data={datachart}
                                    width={450}
                                    height={400}
                                    margin={{
                                        top: 20, right: 20, bottom: 30, left: 20,
                                    }}
                                >
                                    <CartesianGrid />
                                    <XAxis type="number" dataKey={'x'} name={selectedValuex}
                                        style={{ fontSize: '0.8rem', fontFamily: 'Arial' }}
                                        stroke="white" axisLine={false}
                                        tickLine={false}
                                        tickCount={20}
                                        label={{
                                            fontSize: '1.5rem', fontFamily: 'Arial', fill: '#ffffff',
                                            value: selectedValuex, position: 'insideBottom', offset: -12
                                        }}
                                    />
                                    <YAxis type="number"
                                        dataKey={dataKey} name={namey}
                                        style={{ fontSize: '0.8rem', fontFamily: 'Arial' }}
                                        stroke="white" axisLine={false}
                                        tickLine={false}
                                        tickCount={20}
                                        domain={domain}

                                        label={{
                                            fontSize: '1.5rem', fontFamily: 'Arial', fill: '#ffffff',
                                            value: valuey, angle: -90, position: 'left', dy: -70
                                        }} />
                                    <Tooltip wrapperStyle={{ width: 'auto', color: "#000000" }} cursor={{ strokeDasharray: '3 3' }} />
                                    <Scatter activeDot name={namescatterr} data={datachart} fill={colo} />
                                </ScatterChart>
                            </ResponsiveContainer>
                        }
                    </div>
                </Collapse>
            </div>
        </>
    );
}
export default Chart;





