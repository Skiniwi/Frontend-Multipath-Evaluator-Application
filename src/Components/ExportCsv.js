
import React from 'react';
import { CSVLink } from 'react-csv';
import { Button } from 'reactstrap';

export const ExportReactCSV = ({ csvData, fileName }) => {
    return (
        <Button color="info" >
            <CSVLink data={csvData} filename={fileName}>Export</CSVLink>
        </Button>
    )
}