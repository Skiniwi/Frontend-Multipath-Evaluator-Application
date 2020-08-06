import React from "react";
import { A } from "hookrouter";
const Home = () => {
    return (
        <div className="col-md-6 offset-md-3 text-center">
            <h1 className="p-5">
                <br />
                <br />
                <br />
                HFTL Evaluation of Multipath Radio Channels            </h1>
            <h2>
                CLick <A href="/App"> here </A> to start the Client APP
            </h2>
            <hr />
            <p className="lead"></p>
            <h4 className="p2">Future Work:</h4>
            <p className="lead">
                <br />
                -Create Database and merge all Json Simulation Files into it. <br />
                -Login register system with account activation, forgot password, reset
                password, login as well as private and protected routes for
                authenticated user and users with the role of admin.<br />
                -More specific Evaluation Features<br />
                -3D reprensentation<br />
            </p>
        </div>
    );
};

export default Home;
