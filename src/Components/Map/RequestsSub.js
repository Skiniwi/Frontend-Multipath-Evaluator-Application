import React, { useEffect, useState } from "react";
import { useSubscription } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import Map from "./Map";
import Evaluation from "../Evaluation/EvaluationAllPoints";
import GetScenario from "./GetScenarionames";
import OnePoint from '../Evaluation/EvalOnePoint';

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
  const [files, setFile] = useState([]);
  const [txinfo, setTxInfo] = useState([]);

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
    const content = JSON.parse(data.responseAdded.content)
    setFile(content.files)
    setPoints(content.points)
    setTx(content.tx_position)
    setTxInfo(content.tx_info)
  }, [data]);

  const [idd, setIdd] = useState(null);
  const [calculateddata, setCalculateddataa] = useState({});
  const parent = (id) => {
    setIdd(id)
  }
  const evaluation = (calculateddataa) => {
    setCalculateddataa(calculateddataa)
  }
  return (
    <>
      {<GetScenario files={files} />}
      {/* {loading && alert("Please select a Point from the Map to have more options")} */}
      {<Evaluation idd={idd} tx={tx} points={points} evaluationn={evaluation} />}
      {<OnePoint tx={tx} idd={idd} points={points} evaluationn={evaluation} />}


      {<Map txinfo={txinfo} tx={tx} points={points} parentt={parent} calculateddata={calculateddata} />}
    </>
  );
}
export default RequestsSub;
