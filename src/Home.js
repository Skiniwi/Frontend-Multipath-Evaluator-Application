import React from "react";

import { A } from "hookrouter";

const Home = () => {
    return (
        <div className="col-md-6 offset-md-3 text-center">
            <h1 className="p-5">
                {" "}
          Welcome to the Evaluation of Multipath Radio Channels
            </h1>
            <h2>HFTL
            <A href="/App"> Client APP </A>
            </h2>
            <hr />
            <p className="lead">Evaluation of Multipath Radio Channels</p>
            <h4 className="p2">Bonus</h4>
            <p className="lead">
                login register system with account activation, forgot password, reset
                password, login as well as private and protected routes for
                authenticated user and users with the role of admin.
        </p>
        </div>
    );
};

export default Home;
