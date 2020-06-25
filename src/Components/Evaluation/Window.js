import React, { useState, } from "react";
import "../../App.css";
import Chart from "./Chart ";
import { Button, Navbar } from 'reactstrap';
function FloatingWindow() {
    const [showWindow, setShowWindow] = useState(false);
    return (
        <>
            <Navbar dark expand="md">
                <Button onClick={() => setShowWindow(!showWindow)} outline>Evaluation Chart</Button>
            </Navbar>
            {showWindow && <div className="window"> </div >}
        </>
    )
}
export default FloatingWindow;

