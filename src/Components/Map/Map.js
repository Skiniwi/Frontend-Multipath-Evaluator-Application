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
    const polylinesR = [];
    const polylinesD = [];

    const lineOfSight = [];
    const path_pos_array = [];
    const distance_array = [];
    const distance_array_LOS = [];
    const distance_array_polyR = [];
    const distance_array_polyD = [];

    const options = { units: "meters" };
    let tx_point = [];
    const id_poly = [];

    const power_LOS = [];
    const power_arry_without_losR = [];
    const power_arry_without_losD = [];

    let sum_delay = []
    let avg_delay = []
    let sum_power = []
    let avg_power = []
    let sum_strength = []
    let avg_strength = []
    let expectation_delay = []
    let expectation_delay_sq = []
    let delaySpread = []
    let delaySpread1 = []
    let aoaSpread = []
    let aodSpread = []

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
            aoaSpread = calculateddata[i].aoaSpread;
            aodSpread = calculateddata[i].aodSpread;
            delaySpread1 = calculateddata[i].delaySpread1;
        }
    }

    receivers.forEach(d => {
        tx_point = turf.point(transmitter);
        for (let i = 0; i < d.paths.length; i++) {
            if (id === d.point_id) {
                //calculate the distance to the transmitter
                const to = turf.point(selectedPoint);
                const distance = turf.distance(tx_point, to, options);
                distance_array.push(Math.floor(distance));
                if (d.paths[i].num_of_interactions > 0 && selectedPoint.length > 0) {
                    d.paths[i].interactions.forEach(j => {
                        path_pos_array.push([j.position.lat, j.position.lon]);
                        id_poly.push(j.interacted_obj_id)
                        if (j.interaction_type === 'R') {
                            let polylineR = [selectedPoint, [j.position.lat, j.position.lon], transmitter];
                            polylinesR.push(polylineR);
                            const toPoly = turf.lineString(polylineR);
                            const distancePolyR = turf.length(toPoly, options);
                            distance_array_polyR.push(Math.floor(distancePolyR));
                            power_arry_without_losR.push(d.paths[i].power)
                        }
                        if (j.interaction_type === 'D') {
                            let polylineD = [selectedPoint, [j.position.lat, j.position.lon], transmitter];
                            polylinesD.push(polylineD);
                            const toPoly = turf.lineString(polylineD);
                            const distancePolyD = turf.length(toPoly, options);
                            distance_array_polyD.push(Math.floor(distancePolyD));
                            power_arry_without_losD.push(d.paths[i].power)
                        }
                    });
                }
                if (d.paths[i].num_of_interactions === 0 && selectedPoint.length > 0) {
                    let polyline = [selectedPoint, transmitter]
                    lineOfSight.push(polyline);
                    const toPoly = turf.lineString(polyline);
                    const distanceLOS = turf.length(toPoly, options);
                    distance_array_LOS.push(Math.floor(distanceLOS));
                    power_LOS.push(d.paths[0].power)
                }
            }
        }


        const usefullItem = {
            name: d.point_id,
            point: [d.position.lat, d.position.lon],
            number_of_path: d.paths.length,
            number_of_los: distance_array_LOS.length,
            number_of_pathR: distance_array_polyR.length,
            number_of_pathD: distance_array_polyD.length,
            path_pos_array,
            polysR: polylinesR,
            polysD: polylinesD,
            polyLineOfsight: lineOfSight,
            distanceLOS: distance_array_LOS,
            distance_array_polyR: distance_array_polyR,
            distance_array_polyD: distance_array_polyD,
            power_LOS: power_LOS,
            power_arry_without_losR: power_arry_without_losR,
            power_arry_without_losD: power_arry_without_losD,
            sum_delay: sum_delay,
            avg_delay: avg_delay,
            sum_power: sum_power,
            avg_power: avg_power,
            sum_strength: sum_strength,
            avg_strength: avg_strength,
            expectation_delay: expectation_delay,
            expectation_delay_sq: expectation_delay_sq,
            delaySpread: delaySpread,
            aoaSpread: aoaSpread,
            aodSpread: aodSpread,
            delaySpread1: delaySpread1,

        };
        usefullData.push(usefullItem);

    })

    //The parseInt() function parses a string argument and returns an integer of the specified
    const handleClickCircle = (event) => {
        setSelectedPointlatlon([event.target._latlng.lat, event.target._latlng.lng])
        setId(event.sourceTarget.options.id)
        props.parentt(event.sourceTarget.options.id)
    }
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

                {usefullData.map(item => < Circle onClick={handleClickCircle} id={item.name} key={item.name} center={item.point} fillColor="blue"
                    radius={6} >
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
                                        <td>{distance_array[0]} [m] </td>
                                    </tr>
                                    <tr>
                                        <td>Total Rays:</td>
                                        <td>{item.number_of_path}</td>
                                    </tr>
                                    <tr>
                                        <td>LOS Rays:</td>
                                        <td>{item.number_of_los}</td>
                                    </tr>
                                    <tr>
                                        <td>Reflected Rays:</td>
                                        <td>{item.number_of_pathR}</td>
                                    </tr>
                                    <tr>
                                        <td>Diffracted Rays:</td>
                                        <td>{item.number_of_pathD}</td>
                                    </tr>
                                    <tr>
                                        <td> Average Delay:</td>
                                        <td>{item.avg_delay}[µs]</td>
                                    </tr>
                                    <tr>
                                        <td> Average Power:</td>
                                        <td>{item.avg_power}[dBm]</td>
                                    </tr>
                                    <tr>
                                        <td> Average Strength</td>
                                        <td>{item.avg_strength}[dBuV/m]</td>
                                    </tr>

                                    <tr>
                                        <td> DelaySpread:</td>
                                        <td>{item.delaySpread}[µs]</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    } </Popup>

                    {item.polyLineOfsight.length > 0 && <Polyline key={`lospoly${item.name} `} positions={[item.polyLineOfsight]} color={'red'} >

                        <Popup key={`popuplos ${item.name} `} >{
                            <div >
                                <table >
                                    <tbody>
                                        {distance_array_LOS.map((item, index) =>
                                            <tr key={index}>
                                                <td>Distance to Tx  :</td>
                                                <td>{item} [m]  </td>
                                            </tr>
                                        )}
                                        {power_LOS.map((item, index) =>
                                            <tr key={index}>
                                                <td>Power LOS :</td>
                                                <td>{item}  </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>

                            </div >
                        } </Popup>
                    </Polyline>
                    }


                    {item.polysR.length > 0 && <Polyline key={`selectedPointR${item.name} `} positions={[item.polysR]}
                        color={'yellow'}
                        weight={3}
                        opacity={0.2}
                        smoothFactor={5}
                    >
                        <Popup key={`popupR ${item.name} `} >{
                            <div className="popup">
                                <table >
                                    <tbody>
                                        {distance_array_polyR.map((item, index) =>
                                            <tr key={index}>
                                                <td>Distance to Tx {index} :</td>
                                                <td>{item} [m]  </td>
                                            </tr>
                                        )}
                                        {power_arry_without_losR.map((item, index) =>
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
                    {item.polysD.length > 0 && <Polyline key={`selectedPointD${item.name} `} positions={[item.polysD]}
                        color={'orange'}
                        weight={3}
                        opacity={0.2}
                        smoothFactor={5}
                    >
                        <Popup key={`popupD ${item.name} `} >{
                            <div className="popup">
                                <table >
                                    <tbody>
                                        {distance_array_polyD.map((item, index) =>
                                            <tr key={index}>
                                                <td>Distance to Tx {index} :</td>
                                                <td>{item} meter  </td>
                                            </tr>
                                        )}
                                        {power_arry_without_losD.map((item, index) =>
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







