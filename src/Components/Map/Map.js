import React, { useEffect, useState } from "react";
import {
    Map as LeafletMap,
    TileLayer,
    Polyline,
    Popup,
    Circle,
} from "react-leaflet";
import image from "./icons/image.svg";
import Marker from 'react-leaflet-enhanced-marker';
import * as turf from "@turf/turf";
import Chart from "../Evaluation/Chart";
import Evaluation from "../Evaluation/Evaluation";



const Leipzig = [51.315579, 12.377772]
const Map = (props) => {
    const [receivers, setReceivers] = useState([]);
    const [id, setId] = useState(null);

    const [transmitter, setTransmitter] = useState([]);
    useEffect(() => {
        if (!props.points) {
            return
        }
        setReceivers(props.points);
        setTransmitter(props.tx);
    }, [props.tx, props.points, props.parent]);

    const [poly, setPoly] = useState([]);

    const polylines = []
    const lineOfSight = []
    const path_pos_array = [];
    const distance_array = [];

    const delay_array = [];
    const usefullData = [];
    const strength_array = [];
    const sq_st_ar = [];
    const dl_by_st = [];
    const sq_dl_by_st = [];
    const power_array = [];
    const angelofArival_array = [];
    const angelofDepartur_array = [];

    const avg_strength_array = [];
    const calculatedData = [];

    receivers.forEach(d => {

        for (let i = 0; i < d.paths.length; i++) {
            delay_array.push(d.paths[i].delay);
            strength_array.push(d.paths[i].field_strength);
            //The Math.pow() function returns the base to the exponent power, that is, base ^exponent.
            sq_st_ar.push(Math.pow(d.paths[i].field_strength, 2));
            dl_by_st.push(d.paths[i].delay * d.paths[i].field_strength);
            sq_dl_by_st.push(Math.pow(d.paths[i].delay, 2) * d.paths[i].field_strength);
            power_array.push(d.paths[i].power);

            if (id === d.point_id) {

                //calculate the distance to the transmitter
                const tx_point = turf.point(transmitter);
                const options = { units: "meters" };
                const to = turf.point(poly);
                const distance = turf.distance(tx_point, to, options);
                distance_array.push(distance);


                if (d.paths[i].num_of_interactions === 1 && poly.length > 0) {
                    d.paths[i].interactions.forEach(j => {
                        path_pos_array.push([j.position.lat, j.position.lon]);
                        let polyline = [poly, [j.position.lat, j.position.lon], transmitter];
                        polylines.push(polyline);
                        angelofArival_array.push(j.aoa);
                        angelofDepartur_array.push(j.aod);
                    });

                }

                if (d.paths[i].num_of_interactions === 0 && poly.length > 0) {
                    let polyline = [poly, transmitter]
                    lineOfSight.push(polyline);
                }
            }
        }
        const usefullItem = {
            name: d.point_id,
            point: [d.position.lat, d.position.lon],
            number_of_path: d.paths.length,
            path_pos_array,
            polys: polylines,
            polyLineOfsight: lineOfSight,

        };
        usefullData.push(usefullItem);

        //The Math.sqrt() function returns the square root of a number//
        //The reduce() method executes a reducer function (that you provide) on each element of the array, resulting in single output value. //

        //Calculate delay and average of delay:
        const sum_delay = delay_array.reduce((previous, current) => current += previous);
        const avg_delay = sum_delay / delay_array.length;
        //Calculate power and average of power:
        const sum_power = power_array.reduce((previous, current) => current += previous);
        const avg_power = sum_power / power_array.length;
        //Calculate strength and average of strength:
        const sum_strength = sq_st_ar.reduce((previous, current) => current += previous);
        const avg_strength = Math.sqrt(sum_strength / strength_array.length);
        const n_avg_str = parseInt(avg_strength, 10);
        avg_strength_array.push(n_avg_str);


        //calculate the delay spread
        const expectation_delay = dl_by_st.reduce((previous, current) => current += previous)
            / strength_array.reduce((previous, current) => current += previous);
        const expectation_delay_sq = sq_dl_by_st.reduce((previous, current) => current += previous)
            / strength_array.reduce((previous, current) => current += previous);
        const delaySpread = Math.sqrt(expectation_delay_sq - Math.pow(expectation_delay, 2));

        const calculated = {
            sum_delay: sum_delay,
            avg_delay: avg_delay,
            sum_power: sum_power,
            avg_power: avg_power,
            sum_strength: sum_strength,
            avg_strength: avg_strength,
            avg_strength_array: avg_strength_array,
            expectation_delay: expectation_delay,
            expectation_delay_sq: expectation_delay_sq,
            delaySpread: delaySpread,
            distance_array: distance_array
        }
        calculatedData.push(calculated);

    })
    // console.log(calculatedData.avg_power)

    //The parseInt() function parses a string argument and returns an integer of the specified
    // const parentt = () => { props.parent(id) }


    const handleClick = (event) => {
        setPoly([event.target._latlng.lat, event.target._latlng.lng])
        setId(event.sourceTarget.options.id)
        props.parentt(event.sourceTarget.options.id)
    }


    return (
        < div >
            <LeafletMap
                center={Leipzig}
                zoom={15.5}
                maxZoom={19}
                attributionControl={true}
                zoomControl={true}
                doubleClickZoom={true}
                scrollWheelZoom={true}
                dragging={true}
                animate={true}
                easeLinearity={0.35}
            >
                <TileLayer
                    attribution='&copy; <a href="://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
                    url='https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png'
                />
                {transmitter.length > 0 &&
                    < Marker position={transmitter} icon={<img src={image} alt="tx marker" />} >
                        <Popup>{transmitter}</Popup>
                    </Marker >}

                {usefullData.map(item => < Circle onClick={handleClick} id={item.name} key={item.name} center={item.point} fillColor="blue" radius={6} >
                    <Popup key={`popup ${item.name} `} >{<p> ID:{id} Distance to transmitter : {(Math.round(distance_array[0] * 100) / 100).toFixed(2)} meter , Number of path: {item.number_of_path}</p>} </Popup>
                    {item.polyLineOfsight.length > 0 && <Polyline key={`lospoly${item.name} `} positions={[item.polyLineOfsight]} color={'red'} />}
                    {item.polys.length > 0 && <Polyline key={`poly${item.name} `} positions={[item.polys]}
                        color={'yellow'}
                        weight={1}
                        opacity={0.2}
                        smoothFactor={5} />}

                    <Chart x={props.x} y={props.y} selectedValuex={props.selectedValuex}
                        selectedValuey={props.selectedValuey} selectedchart={props.selectedchart} deleteChart={() => props.deleteChart(props.index)} />

                </Circle >)}
                {/* <div className="pointeval">
                    <Evaluationreceiver />
                </div> */}
            </LeafletMap>
        </div >
    );
}
export default Map;







