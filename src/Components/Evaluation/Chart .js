import React, { useEffect, useState } from "react";
import {
    ScatterChart, Scatter, XAxis, YAxis, CartesianGrid
    , ResponsiveContainer, Tooltip
} from 'recharts';
import "../../App.css";
import { Collapse, Button, Navbar, Spinner } from 'reactstrap';


function Chart(props) {
    const [namescatter, setNameScatter] = useState('')
    const [selectedValuex, setSelectedValuex] = useState('')
    const [selectedValuey, setSelectedValuey] = useState('')

    const [x, setXarray] = useState([])
    const [y, setYarray] = useState([])

    const [d, setD] = useState([])

    useEffect(() => {
        const array = [];
        let mix = x[0]; let Max = x[0];
        let miy = y[0]; let May = y[0];
        for (let i = 0; i < x.length; i++) {
            array.push({ 'x': x[i], 'y': y[i] })
            let v = x[i];
            let w = y[i];
            mix = (v < mix) ? v : mix;
            Max = (v > Max) ? v : Max;
            miy = (w < miy) ? w : miy;
            May = (w > May) ? w : May;
            setD(array)
        }
    }, [x, y])

    useEffect(() => {

        if (!props.x) {
            return
        };
        setXarray(props.x);
        setYarray(props.y);

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
    }, [props.x, props.y, props.selectedValuex, props.selectedValuey]);

    const [collapse, setCollapse] = useState(true);
    const [status, setStatus] = useState(namescatter);
    const onEntering = () => setStatus(<Spinner size="sm" color="light" />);
    const onEntered = () => setStatus(namescatter);
    const onExiting = () => setStatus(<Spinner size="sm" color="light" />)
    const onExited = () => setStatus(namescatter);
    const toggle = () => setCollapse(!collapse);
    return (


        <div className="openandclosechart">
            <Navbar className="nav" expand="sm">
                <h5>{status}</h5>
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
                <div className="chart">
                    <ResponsiveContainer>
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
                            <YAxis type="number" dataKey={'y'} name={selectedValuey}
                                style={{ fontSize: '0.8rem', fontFamily: 'Arial' }}
                                stroke="white" axisLine={false}
                                tickLine={false}
                                tickCount={20}
                                label={{
                                    fontSize: '1.5rem', fontFamily: 'Arial', fill: '#ffffff',
                                    value: selectedValuey, angle: -90, position: 'insideLeft'
                                }}


                            />
                            <Tooltip wrapperStyle={{ backgroundColor: '#ccc' }} cursor={{ strokeDasharray: '3 3' }} />
                            {/* {selectedValuex && <Legend className="recharts-legend-item " wrapperStyle={{ top: 360, left: 50 }} name={namescatter} />} */}
                            <Scatter name={namescatter} data={d} fill='#00ff00' />
                        </ScatterChart>
                    </ResponsiveContainer>
                </div>
            </Collapse>


        </div>

    );
}
export default Chart;