import React, { useEffect, useState } from "react";
import cdf from 'cumulative-distribution-function';
import {
    ScatterChart, Scatter, XAxis, YAxis, CartesianGrid,
    ResponsiveContainer, Tooltip
} from 'recharts';
import { Collapse, Button, Navbar, Spinner } from 'reactstrap';

import "../../App.css";

function ChartCdf(props) {
    const [namescatter, setNameScatter] = useState('')
    const [selectedValuex, setSelectedValuex] = useState('')
    const [x, setXarray] = useState([])
    const [d, setD] = useState([])

    useEffect(() => {
        const mycdf = cdf(x);
        const cdfx = mycdf.xs()
        const cdfy = mycdf.ps()
        const array = cdfx.map((v, i) => ({ 'x': v, 'y': cdfy[i] }));
        setD(array)

    }, [x])

    useEffect(() => {
        if (!props.x) {
            return
        };
        setXarray(props.x);

        if (!props.selectedValuex) {
            return
        };
        setSelectedValuex(props.selectedValuex.slice(0, 1).toUpperCase() +
            props.selectedValuex.slice(1, props.selectedValuex.length));
        setNameScatter(props.selectedValuex.slice(0, 1).toUpperCase() +
            props.selectedValuex.slice(1, props.selectedValuex.length) + '/cdf')
    }, [props.x, props.selectedValuex]);

    const [collapse, setCollapse] = useState(true);
    const [status, setStatus] = useState(namescatter);
    const onEntering = () => setStatus(<Spinner size="sm" color="light" />);
    const onEntered = () => setStatus(namescatter);
    const onExiting = () => setStatus(<Spinner size="sm" color="light" />)
    const onExited = () => setStatus(namescatter);
    const toggle = () => setCollapse(!collapse);

    return (

        <div className="openandclosechart" >
            <Navbar className="nav" expand="sm">
                <h5>{status} </h5>
                <Button className="btn_in_nav_chart" size="sm" dark="true" onClick={toggle} >
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
                <div className="chart" >
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
                            <YAxis type="number" dataKey={'y'} name={'Cdf'}
                                style={{ fontSize: '0.8rem', fontFamily: 'Arial' }}
                                stroke="white" axisLine={false}
                                tickLine={false}
                                tickCount={20}
                                domain={[0, 1]}
                                label={{
                                    fontSize: '1.5rem', fontFamily: 'Arial', fill: '#ffffff',
                                    value: "CDF", angle: -90, position: 'insideLeft'
                                }}

                            />
                            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                            {/* {selectedValuex && <Legend className="recharts-legend-item " wrapperStyle={{ top: 360, left: 50 }} name={namescatter} />} */}
                            <Scatter name={namescatter} data={d} fill='#00ff00' line />
                        </ScatterChart>
                    </ResponsiveContainer>
                </div>
                &nbsp;

            </Collapse>
        </div >

    );
}
export default ChartCdf;