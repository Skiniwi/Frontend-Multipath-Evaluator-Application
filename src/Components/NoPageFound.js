import React from "react";
import { A } from "hookrouter";
import { Button } from "reactstrap";


export const NoPageFound = () => {
    return (
        <div className="App">
            <Button variant="dark" size="bm" >
                <A href="/"> HOME </A>
            </Button>{" "}
            <h1>404</h1>
            <p>Page doesn't exist</p>
        </div>
    );
};