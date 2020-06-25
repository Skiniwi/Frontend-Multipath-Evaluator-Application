import React, { useEffect, useState } from "react";
import {
    Map as LeafletMap,
    TileLayer,
    // Polyline,
    Popup,
    Circle,
} from "react-leaflet";
import uuid from "react-uuid";
import image from "./icons/image.svg";
import Marker from 'react-leaflet-enhanced-marker';
const Leipzig = [51.310479, 12.387772]
const Map = (props) => {
    const [rxs, setRxs] = useState([]);
    const [tx, setTx] = useState([]);

    useEffect(() => {
        if (!props.rxss) {
            return
        }
        setTx(props.tx);
        setRxs(props.rxss);
    }, [props.rxss, props.tx]);

    const latArray = []
    const lonArray = []

    rxs.map(function (item) {
        latArray.push(item.lat);
        lonArray.push(item.lon);
        return null
    })

    const latlonArray = (lat, lon) => {
        return {
            key: uuid(), position: {
                lat: lat,
                lon: lon,
            }
        }
    }

    const latlonArrayList = []

    for (let i = 0; i < latArray.length; i++) {
        if (i % 2 === 0) {
            latlonArrayList.push(latlonArray(latArray[i], lonArray[i]))
        }
    }

    // const [poly, setPoly] = useState([]);
    // const handleClick = (event) => (
    //     setPoly(event.item.position)
    // );
    // console.log(poly)

    return (
        < div >
            <LeafletMap
                center={Leipzig}
                zoom={15}
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
                {latlonArrayList.map(item => < Circle key={item.key} center={item.position} fillColor="blue" radius={6} >
                    <Popup >{<p> lat: {item.position.lat} , lont:{item.position.lon}</p>} </Popup>
                    {/* <Polyline key={item.key} positions={[tx, poly]} color={'red'} /> */}</Circle >)}


                {/* {poly.length > 0 && latlonArrayList.map(item => (<Polyline key={item.key} positions={[tx, poly]} color={'red'} />))} */}

            </LeafletMap>
        </div >
    );
}
export default Map;
