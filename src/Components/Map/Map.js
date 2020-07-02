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

const Leipzig = [51.315579, 12.377772]
const Map = (props) => {
    const [points, setPoints] = useState([]);

    const [tx, setTx] = useState([]);
    useEffect(() => {
        if (!props.points) {
            return
        }
        setPoints(props.points)
        setTx(props.tx);

    }, [props.tx, props.points]);

    const [poly, setPoly] = useState([]);
    const usefullData = [];
    const polylines = []
    const lineOfSight = []
    const path_pos_array = [];
    const distance_array = [];


    const [id, setId] = useState(null);
    const handleClick = (event) => {
        setPoly([event.target._latlng.lat, event.target._latlng.lng])
        setId(event.sourceTarget.options.id)

    };

    points.forEach(d => {

        for (let i = 0; i < d.paths.length; i++) {

            if (d.paths[i].num_of_interactions === 1 && poly.length > 0) {
                if (id === d.point_id) {

                    //calculate the distance to the transmitter
                    const tx_point = turf.point(tx);
                    const options = { units: "meters" };
                    const to = turf.point(poly);
                    const distance = turf.distance(tx_point, to, options);
                    distance_array.push(distance);
                    d.paths[i].interactions.forEach(j => {
                        path_pos_array.push([j.position.lat, j.position.lon]);
                        let polyline = [poly, [j.position.lat, j.position.lon], tx];
                        polylines.push(polyline);

                    });
                }
            }


            if (d.paths[i].num_of_interactions === 0 && poly.length > 0) {
                let polyline = [poly, tx]
                lineOfSight.push(polyline);
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
    })

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
                {tx.length > 0 &&
                    < Marker position={tx} icon={<img src={image} alt="tx marker" />} >
                        <Popup>{tx}</Popup>
                    </Marker >}

                {usefullData.map(item => < Circle onClick={handleClick} id={item.name} key={item.name} center={item.point} fillColor="blue" radius={6} >
                    <Popup key={`popup ${item.name} `} >{<p> Distance to tx : {(Math.round(distance_array[0] * 100) / 100).toFixed(2)} meter , Number of path: {item.number_of_path}</p>} </Popup>
                    {item.polyLineOfsight.length > 0 && <Polyline key={`lospoly${item.name} `} positions={[item.polyLineOfsight]} color={'red'} />}
                    {item.polys.length > 0 && <Polyline key={`poly${item.name} `} positions={[item.polys]}
                        color={'yellow'}
                        weight={1}
                        opacity={0.2}
                        smoothFactor={5} />}

                </Circle >)}



            </LeafletMap>
        </div >
    );
}
export default Map;







