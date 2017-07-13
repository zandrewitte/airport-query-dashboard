import React, { Component, PropTypes } from 'react';
import {Row, Col} from 'react-bootstrap';

const _ = require('lodash');

function isNull(v) {
    return v === null || typeof v === 'undefined' || v === undefined || v === 'undefined';
}

export default class TableHeader extends Component {

    constructor(props) {
        super(props);
        this.state = {
            sortColumnIndex: isNull(props.sortColumnIndex)? -1 : props.sortColumnIndex,
            sortDirection: 'asc',
        }

    }

    render() {
        return <Row className="header-row">
            {
                _.reduce(this.props.headers, (acc, header, i) => 
                    this.props.columnsIndex.includes(i) ?
                        acc.concat(<Col className={`header-${header.toLowerCase().replace(/ /g, '-')} ${i === this.state.sortColumnIndex? `sort-${this.state.sortDirection}` : ''} `}
                                onClick={(e) => this._sortCol(e, i, this) } md={this.props.cols} sm={this.props.cols} xs={this.props.cols}>{header}<a /></Col>) 
                        :
                        acc
                , [])
            }
        </Row>
    }

    _sortCol(e, i, self) {
        let sortDirection = 'asc';
        if(this.state.sortColumnIndex === i){
            if(this.state.sortDirection === 'asc')
                sortDirection = 'desc';
        }

        let columnPath = this.props.sortColumnPaths[i];
        let direction = 1;
        if(sortDirection === 'desc')
            direction = -1;

        this.setState({sortColumnIndex: i, sortDirection}, this.props.sortData(columnPath, direction));
    }

}