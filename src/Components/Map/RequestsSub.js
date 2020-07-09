import React, { useEffect, useState } from "react";
import { useSubscription } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import Map from "./Map";
import DropdownButtonEvaluation from "../Evaluation/ButtonEvaluation";
import Evaluation from "../Evaluation/Evaluation";

// const id = require('./Map');
const REQUESTS_SUBSCRIPTION = gql`
  subscription onResponseAdded($userID: String!) {
    responseAdded(userID: $userID) {
      id
      request {
        id
        content
        status
        createdAt
      }
      service {
        id
      }
      content
      contentType
    }
  }
`;

function RequestsSub() {

  const { data } = useSubscription(REQUESTS_SUBSCRIPTION, {
    variables: { userID: "web_raytracer" },
  });
  const [points, setPoints] = useState([]);
  const [tx, setTx] = useState([]);
  useEffect(() => {
    if (
      !data ||
      !data.responseAdded ||
      !data.responseAdded.service ||
      !data.responseAdded.service.id ||
      data.responseAdded.service.id !== "service_sum"
    ) {
      return;
    }
    const content = JSON.parse(data.responseAdded.content);

    setPoints(content.points)
    setTx(content.tx_position)
  }, [data]);
  const [idd, setIdd] = useState(null);

  const parent = (id) => {
    setIdd(id) // const idCopy = Object.assign([], id);
  }
  console.log(idd)
  return (
    <>
      {/* {loading && alert("Please select a Point from the Map to have more options")} */}
      {<DropdownButtonEvaluation idd={idd} tx={tx} points={points} />}
      {<Map tx={tx} points={points} parentt={parent} />}
      {/* {<Evaluation tx={tx} points={points} />} */}
    </>
  );
}
export default RequestsSub;
