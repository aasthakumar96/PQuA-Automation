import React, {Component} from 'react'
import { TableView, TableHeader, TableBody, Row, Column, Cell} from '@react-spectrum/table'
import { Link, Flex } from '@adobe/react-spectrum'
import LinkOutLight from '@spectrum-icons/workflow/LinkOutLight';
//import { Link } from 'react-router-dom';

class TableComponent extends Component {
    render(){
        let headers = this.props.headers;
        let data = this.props.data;
        let tableBody;

        /*Object.keys(data).forEach((rowKey) => {
            let row;
            Object.keys(data[rowKey]).forEach((cellKey) => {
                row.add(data[rowKey][cellKey]);
            }
        })*/

        return(
            <TableView aria-label="Generic table component" marginTop="size-300" height="size=3000" overflowMode="wrap">
                <TableHeader>
                {
                     headers.map((header) => {
                        return <Column>{header}</Column>
                     })
                }
                </TableHeader>
                <TableBody>
               {
                   data.map(entry => {
                        return <Row>
                            {
                                Object.keys(entry).map(cellKey => {
                                    if(cellKey == "jiraLink" && entry[cellKey] != "No JQL Query Found") {
                                        return <Cell>
                                                    <Flex direction="row" gap="size-50" alignItems="end">
                                                        <Link>
                                                            <a href={entry[cellKey]} target="_blank">
                                                                View in Jira
                                                            </a>
                                                        </Link>
                                                        <LinkOutLight size='XS'/>
                                                    </Flex>
                                            </Cell>
                                    }
                                    else {
                                        return <Cell>{entry[cellKey]}</Cell>
                                    }
                                })
                        }
                            </Row>
                   })

                }
                </TableBody>
            </TableView>
        )
    }
}

export default TableComponent;