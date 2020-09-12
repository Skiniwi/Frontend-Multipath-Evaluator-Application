import React, { useEffect, useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import AddRequest from "./GetPointsData";

const ADD_REQUEST = gql`
mutation createRequest($content: String!, $serviceID: String!) {
  createRequest(
    input: {
      contentType: "application/json"
      serviceID: $serviceID
      content: $content
      acceptContentType: "application/json"
      forceUpdate: true
    }
  ) {
    id
    status
  }
}
  
`;
function GetScenario(props) {
    const [files, setFiles] = useState([]);
    useEffect(() => {
        if (!props.files) {
            return
        }
        setFiles(props.files);
    }, [props.files]);


    const [addRequest1] = useMutation(ADD_REQUEST);
    const handleAddRequest1 = (event) => {
        addRequest1({
            variables: {
                serviceID: "service_sum", content: 'getnameoffiles'
            },
        });
    };

    return (
        <>
            <div className="windowaddrequest1" >
                <div><AddRequest files={files} handleAddRequest11={handleAddRequest1} /></div>
            </div>
        </>
    );
}
export default GetScenario;
