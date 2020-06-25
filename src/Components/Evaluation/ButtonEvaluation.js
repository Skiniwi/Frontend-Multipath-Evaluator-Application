import React, { useState, useEffect } from "react";
import "../../App.css";
import { Input, FormGroup, DropdownItem, Button, ButtonGroup } from 'reactstrap';
import Chart from "./Chart ";
import ChartCdf from "./ChartCdf";
function DropdownButtonEvaluation(props) {
    //Split Down Button for Evaluation
    const [paths, setPaths] = useState([])
    useEffect(() => {
        if (!props.pathss) {
            return
        }
        setPaths(props.pathss);
    }, [props.pathss]);
    const [key1, setKey1] = useState([])
    const [key2, setKey2] = useState([])
    function KeysFunction() {
        paths.map(function (item) {
            item.map(function (path) {
                const keypath = Object.keys(path);
                setKey1(keypath);
                setKey2(keypath);
                return null
            }); return null
        });
    }

    const [selectedValuex, setSelectedValuex] = useState('')
    const [selectedValuey, setSelectedValuey] = useState('')
    function handleChangex(event) { setSelectedValuex(event.target.value) }
    function handleChangey(event) { setSelectedValuey(event.target.value) }
    const x = []
    const y = []

    function xFunction() {
        paths.map(function (item) {
            for (var i = 0; i < item.length; i++) {
                if (selectedValuex === 'power') { x.push(item[i].power) } else if (selectedValuex === 'delay') { x.push(item[i].delay) } else if (selectedValuex === 'field_strength') { x.push(item[i].field_strength) } else { console.log('choose another option') }
            } return null
        }); return null
    }
    function yFunction() {
        paths.map(function (item) {
            for (var i = 0; i < item.length; i++) {
                if (selectedValuey === 'power') { y.push(item[i].power) } else if (selectedValuey === 'delay') { y.push(item[i].delay) } else if (selectedValuey === 'field_strength') { y.push(item[i].field_strength) } else { console.log('choose another option') }
            } return null
        }); return null
    }

    const [box, setBox] = useState([])

    function createNewChart() {
        setBox(p => [...p, {
            x,
            y,
            selectedValuex,
            selectedValuey
        }]);
    }


    return (
        <>
            <div className="windowbutton" >
                <ButtonGroup className="button" size="sm">

                    <FormGroup onClick={KeysFunction}>
                        <DropdownItem header >  <div className="headerdropdownitem" >Select X Axis </div ></DropdownItem>
                        <Input type="select" name='select' id="xSelect" defaultChecked
                            value={selectedValuex} onChange={handleChangex} >
                            {key1.length > 0 && key1.map((item1, index1) => <option key={index1} >{item1}</option>)}
                        </Input>
                    </FormGroup>

                    <FormGroup onClick={KeysFunction}>
                        <DropdownItem header> <div className="headerdropdownitem" >Select Y Axis </div > </DropdownItem>
                        <Input type="select" name="select" id="ySelect" defaultChecked
                            value={selectedValuey} onChange={handleChangey} >
                            {key2.length > 0 && key2.map((item, index) => <option key={index} >{item}</option>)}
                        </Input>
                        <Button onClick={() => { createNewChart(); yFunction(); xFunction(); }} >Start Evaluation</Button>
                    </FormGroup>
                </ButtonGroup>

                <DropdownItem size="sm" header> <div className="headerdropdownitemcdf" >CDF Chart</div > </DropdownItem>
                <Input className="checkboxcdf" addon type="checkbox" aria-label="Checkbox for following text input" />

            </div>
            <div className="window">
                {/* <Chart x={x} y={y} selectedValuex={selectedValuex} selectedValuey={selectedValuey} /> */}
                {box.map(({ x, y, selectedValuex, selectedValuey }) => (
                    <ChartCdf x={x} y={y} selectedValuex={selectedValuex} selectedValuey={selectedValuey} />
                ))}
            </div>


            {/* <div>
                <ChartCdf x={x} selectedValuex={selectedValuex} />
            </div> */}

        </>
    );
}
export default DropdownButtonEvaluation;


