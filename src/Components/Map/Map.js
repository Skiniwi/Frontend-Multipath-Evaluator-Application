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
// import { LassoControl } from "leaflet-lasso";

const Leipzig = [51.315579, 12.377772]
const Map = (props) => {
    const [receivers, setReceivers] = useState([]);
    const [id, setId] = useState(null);
    const [calculateddata, setCalculateddataa] = useState({});
    const [transmitter, setTransmitter] = useState([]);
    const [txinfo, setTxInfo] = useState([]);

    useEffect(() => {
        if (!props.points) {
            return

        }
        setReceivers(props.points);
        setTransmitter(props.tx);
        setCalculateddataa(props.calculateddata);
        setTxInfo(props.txinfo)
    }, [props.tx, props.points, props.parent, props.calculateddata, props.txinfo]);

    const [selectedPoint, setSelectedPointlatlon] = useState([]);

    const usefullData = [];
    const polylines = []
    const lineOfSight = []
    const path_pos_array = [];
    const distance_array = [];
    const distance_array_poly = [];
    const options = { units: "meters" };
    let tx_point = [];
    const id_poly = [];
    const power_arry_without_los = [];

    let sum_delay = []
    let avg_delay = []
    let sum_power = []
    let avg_power = []
    let sum_strength = []
    let avg_strength = []
    let expectation_delay = []
    let expectation_delay_sq = []
    let delaySpread = []

    for (let i = 0; i < calculateddata.length; i++) {
        if (calculateddata.length !== null) {
            sum_delay = calculateddata[i].sum_delay;
            avg_delay = calculateddata[i].avg_delay;
            sum_power = calculateddata[i].sum_power;
            avg_power = calculateddata[i].avg_power;
            sum_strength = calculateddata[i].sum_strength;
            avg_strength = calculateddata[i].avg_strength;
            expectation_delay = calculateddata[i].expectation_delay;
            expectation_delay_sq = calculateddata[i].expectation_delay_sq;
            delaySpread = calculateddata[i].delaySpread;
        }
    }

    receivers.forEach(d => {
        tx_point = turf.point(transmitter);
        for (let i = 0; i < d.paths.length; i++) {
            if (id === d.point_id) {
                //calculate the distance to the transmitter
                const to = turf.point(selectedPoint);
                const distance = turf.distance(tx_point, to, options);
                // distance_array.push((Math.round(distance * 100) / 100).toFixed(3));
                distance_array.push(distance);

                // const too = turf.point(selectedPoly);
                // const distancePoly = turf.distance(tx_point, too, options);
                // distance_array_poly.push(distancePoly);
                if (d.paths[i].num_of_interactions > 0 && selectedPoint.length > 0) {
                    power_arry_without_los.push(d.paths[i].power);
                    d.paths[i].interactions.forEach(j => {
                        path_pos_array.push([j.position.lat, j.position.lon]);
                        id_poly.push(j.interacted_obj_id)
                        let polyline = [selectedPoint, [j.position.lat, j.position.lon], transmitter];
                        polylines.push(polyline);
                        const toPoly = turf.lineString(polyline);
                        const distancePoly = turf.length(toPoly, options);
                        distance_array_poly.push(Math.floor(distancePoly));
                    });
                }
                if (d.paths[i].num_of_interactions === 0 && selectedPoint.length > 0) {
                    let polyline = [selectedPoint, transmitter]
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
            distance_array_poly: distance_array_poly,
            power_arry_without_los: power_arry_without_los,
            sum_delay: sum_delay,
            avg_delay: avg_delay,
            sum_power: sum_power,
            avg_power: avg_power,
            sum_strength: sum_strength,
            avg_strength: avg_strength,
            expectation_delay: expectation_delay,
            expectation_delay_sq: expectation_delay_sq,
            delaySpread: delaySpread,

        };
        usefullData.push(usefullItem);

    })



    //The parseInt() function parses a string argument and returns an integer of the specified
    // const parentt = () => { props.parent(id) }

    const handleClickCircle = (event) => {
        setSelectedPointlatlon([event.target._latlng.lat, event.target._latlng.lng])
        setId(event.sourceTarget.options.id)
        props.parentt(event.sourceTarget.options.id)
    }
    // selectedPoly.forEach(d => {
    //     // for (let i = 0; i < selectedPoly.length; i++) {
    //     const toPoly = turf.lineString([[d[0].lat, d[0].lng], [d[1].lat, d[1].lng], [d[2].lat, d[2].lng]]);
    //     const distancePoly = turf.length(toPoly, options);
    //     distance_array_poly.push((Math.round(distancePoly * 100) / 100).toFixed(3));
    //     console.log(distance_array_poly)

    //     // }
    // })

    // const handleClickPoly = (event) => {
    //     setSelectedPolylatlon(event.target._latlngs[0])
    //     // console.log(event.target._latlngs[0])
    //     // console.log(selectedPoly)

    // }

    return (
        < div >
            <LeafletMap
                center={Leipzig}
                zoom={10.5}
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
                        <Popup>  {
                            <table>
                                <tbody>
                                    <tr>
                                        <th scope="row"> Tx Antenna</th>
                                    </tr>
                                    <tr>
                                        <td>Type of Antenna:</td>
                                        <td>{txinfo['Type of Antenna']} </td>
                                    </tr>
                                    <tr>
                                        <td>Tx Power:</td>
                                        <td>{txinfo['power']} W </td>
                                    </tr>
                                    <tr>
                                        <td> Frequency:</td>
                                        <td>{txinfo['frequency']}Ghz </td>
                                    </tr>
                                </tbody>
                            </table>}</Popup>
                    </Marker >}

                {usefullData.map(item => < Circle onClick={handleClickCircle} id={item.name} key={item.name} center={item.point} fillColor="blue" radius={6} >
                    <Popup key={`popup ${item.name} `} >{
                        <div className="popup">
                            <table>
                                <tbody>
                                    <tr>
                                        <td>ID :</td>
                                        <td>{id} </td>
                                    </tr>
                                    <tr>
                                        <td>Position Lat:</td>
                                        <td>{item.point[0]} </td>
                                    </tr>
                                    <tr>
                                        <td>Position Lon:</td>
                                        <td>{item.point[1]}</td>
                                    </tr>
                                    <tr>
                                        <td>Distance to Tx :</td>
                                        <td>{distance_array[0]} meter </td>
                                    </tr>
                                    <tr>
                                        <td> Number of Paths:</td>
                                        <td>{item.number_of_path}</td>
                                    </tr>
                                    <tr>
                                        <td> Average Delay:</td>
                                        <td>{item.avg_delay} </td>
                                    </tr>
                                    <tr>
                                        <td> Average Power:</td>
                                        <td>{item.avg_power}</td>
                                    </tr>
                                    <tr>
                                        <td> Average Strength</td>
                                        <td>{item.avg_strength}</td>
                                    </tr>
                                    <tr>
                                        <td> DelaySpread:</td>
                                        <td>{item.delaySpread}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    } </Popup>

                    {item.polyLineOfsight.length > 0 && <Polyline key={`lospoly${item.name} `} positions={[item.polyLineOfsight]} color={'red'} />}

                    {item.polys.length > 0 && <Polyline key={`selectedPoint${item.name} `} positions={[item.polys]}
                        color={'yellow'}
                        weight={3}
                        opacity={0.2}
                        smoothFactor={5}
                    >
                        <Popup key={`popup ${item.name} `} >{
                            <div className="popup">
                                <table >
                                    <tbody>
                                        {distance_array_poly.map((item, index) =>
                                            <tr key={index}>
                                                <td>Distance to Tx {index} :</td>
                                                <td>{item} meter  </td>
                                            </tr>
                                        )}
                                        {power_arry_without_los.map((item, index) =>
                                            <tr key={index}>
                                                <td>Power {index} :</td>
                                                <td>{item}  </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>

                            </div >
                        } </Popup>
                    </Polyline>
                    }
                </Circle >)}
            </LeafletMap>
        </div >
    );
}
export default Map;







