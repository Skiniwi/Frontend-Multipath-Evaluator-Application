import React, { useEffect, useState } from "react";
import cdf from 'cumulative-distribution-function';
import {
    ScatterChart, Scatter, XAxis, YAxis, CartesianGrid,
    Legend, ResponsiveContainer, Tooltip
} from 'recharts';
import "../../App.css";

function ChartCdf(props) {
    const [namescatter, setNameScatter] = useState('')
    const [selectedValuex, setSelectedValuex] = useState('')
    const [selectedValuey, setSelectedValuey] = useState('')

    const [x, setXarray] = useState([])
    const [y, setYarray] = useState([])

    const [d, setD] = useState([])

    useEffect(() => {
        const mycdf = cdf(x);
        const cdfx = mycdf.xs()
        const cdfy = mycdf.ps()
        const array = cdfx.map((v, i) => ({ 'x': v, 'y': cdfy[i] }));
        setD(array)

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


    return (
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
                    />
                    <YAxis type="number" dataKey={'y'} name={selectedValuey}
                        style={{ fontSize: '0.8rem', fontFamily: 'Arial' }}
                        stroke="white" axisLine={false}
                        tickLine={false}
                        tickCount={20}
                        domain={0, 1}

                    />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                    {selectedValuex && <Legend className="recharts-legend-item " wrapperStyle={{ top: 250, left: 50 }} name={namescatter} />}
                    <Scatter name={namescatter} data={d} fill='#00ff00' line />
                </ScatterChart>
            </ResponsiveContainer>
        </div>
    );
}
export default ChartCdf;