import {
    Button,
    Navbar, Collapse, Spinner

} from 'reactstrap';
import React, { useEffect, useState } from "react";
import cdf from 'cumulative-distribution-function';
import {
    ScatterChart, Scatter, XAxis, YAxis, CartesianGrid,
    ResponsiveContainer, Tooltip
} from 'recharts';
import "../../App.css";
import uuid from 'react-uuid';


function Chart(props) {
    const [dCdf, setDCdf] = useState([])
    const [d, setD] = useState([])

    const [y, setYarray] = useState([])
    const [x, setXarray] = useState([])

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
        const array = cdfx.map((v, i) => ({ 'x': v, 'yCdf': cdfy[i] }));
        setDCdf(array)
    }, [x])
    const [selectedchart, setSelectedchart] = useState('')
    const [namescatter, setNameScatter] = useState('')
    const [nameScatterCdf, setNameScatterCdf] = useState('')
    const [selectedValuex, setSelectedValuex] = useState('')
    const [selectedValuey, setSelectedValuey] = useState('')
    useEffect(() => {
        if (!props.x) {
            return
        };
        setXarray(props.x);
        setYarray(props.y);
        setSelectedchart(props.selectedchart)

        if (!props.selectedValuex) {
            return
        };
        setSelectedValuex(props.selectedValuex.slice(0, 1).toUpperCase() +
            props.selectedValuex.slice(1, props.selectedValuex.length));
        setSelectedValuey(props.selectedValuey.slice(0, 1).toUpperCase() +
            props.selectedValuey.slice(1, props.selectedValuey.length));

        setNameScatter(props.selectedValuex.slice(0, 1).toUpperCase() +
            props.selectedValuex.slice(1, props.selectedValuex.length)
            + '/' + props.selectedValuey.slice(0, 1).toUpperCase() +
            props.selectedValuey.slice(1, props.selectedValuey.length))

        setNameScatterCdf(props.selectedValuex.slice(0, 1).toUpperCase() +
            props.selectedValuex.slice(1, props.selectedValuex.length) + '/cdf')

    }, [props.x, props.y, props.selectedValuex, props.selectedValuey, props.selectedchart]);

    const [collapse, setCollapse] = useState(true);
    const [status, setStatus] = useState(namescatter);
    const onEntering = () => setStatus(<Spinner size="sm" color="light" />);
    const onEntered = () => setStatus(namescatter);
    const onExiting = () => setStatus(<Spinner size="sm" color="light" />)
    const onExited = () => setStatus(namescatter);
    const toggle = () => setCollapse(!collapse);
    const [namey, setNamey] = useState("")
    const [dataKey, setDataKey] = useState("")
    const [valuey, setValuey] = useState("")
    const [namescatterr, setNamescatterr] = useState("")
    const [datachart, setDatachart] = useState([])
    const [domain, setDomain] = useState()

    useEffect(() => {
        if (selectedchart === "Scatter Chart") {
            setDataKey("y");
            setNamey(selectedValuey);
            setValuey(selectedValuey);
            setNamescatterr(namescatter);
            setDatachart(d)
        }
        else if (selectedchart === "CDF Chart") {
            setDataKey("yCdf");
            setNamey("Cdf");
            setValuey("Cdf");
            setNamescatterr(nameScatterCdf);
            setDatachart(dCdf);
            setDomain([0, 1])
        }

    }, [selectedchart, selectedValuey, namescatter, d, nameScatterCdf, dCdf])

    const deleteChart = () => props.deleteChart(props.index)
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
                        <ResponsiveContainer >
                            <ScatterChart
                                width={500}
                                height={400}
                                margin={{
                                    top: 20, right: 20, bottom: 20, left: 20,
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
                                        value: valuey, angle: -90, position: 'insideLeft'
                                    }} />
                                <Tooltip wrapperStyle={{ backgroundColor: '#ccc' }} cursor={{ strokeDasharray: '3 3' }} />
                                {/* {selectedValuex && <Legend className="recharts-legend-item " wrapperStyle={{ top: 360, left: 50 }} name={namescatter} />} */}
                                <Scatter name={namescatterr} data={datachart} fill='#00ff00' />
                            </ScatterChart>
                        </ResponsiveContainer>
                    </div>
                </Collapse>
            </div>
        </>
    );
}
export default Chart;





