import React, { useEffect, useState } from "react";
import { useSubscription } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import Coordinates from "./coordinates";


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

  const { data, loading } = useSubscription(REQUESTS_SUBSCRIPTION, {
    variables: { userID: "web_raytracer" },
  });
  const [rxss, setRxss] = useState([]);
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
    setRxss(content.rxs_position)
    setTx(content.tx_position)


  }, [data]);

  return (
    <>

      {loading && <div>Awaiting data</div>}
      {<Coordinates tx={tx} rxss={rxss} />}
    </>
  );
}


export default RequestsSub;
