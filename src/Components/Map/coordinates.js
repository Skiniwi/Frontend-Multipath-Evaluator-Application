import React, { useEffect, useState } from "react";
import {
    Map as LeafletMap,
    TileLayer,
    Marker,
    Popup,
} from "react-leaflet";
import uuid from "react-uuid";

const Leipzig = [51.343479, 12.387772]
const Coordinates = (props) => {

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


    return (
        < div >
            <LeafletMap
                center={Leipzig}
                zoom={11}
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
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {tx.length > 0 &&
                    < Marker position={tx} >
                        <Popup>here Markertest from api </Popup>
                    </Marker >}
                {latlonArrayList.map(item => < Marker key={item.key} position={item.position} >
                    <Popup>here Markertest from api </Popup>
                </Marker >)}

            </LeafletMap>
        </div >
    );
}
export default Coordinates;
