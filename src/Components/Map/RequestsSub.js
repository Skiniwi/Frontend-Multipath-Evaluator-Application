import React, { useEffect, useState } from "react";
import { useSubscription } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import Map from "./Map";
import DropdownButtonEvaluation from "../Evaluation/ButtonEvaluation";

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


  return (
    <>
      {/* {loading && alert("Please select a Point from the Map to have more options")} */}
      {<DropdownButtonEvaluation points={points} />}
      {<Map tx={tx} points={points} />}
    </>
  );
}


export default RequestsSub;
