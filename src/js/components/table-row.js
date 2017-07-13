import React, { Component, PropTypes } from 'react';
import {Row, Col} from 'react-bootstrap';
import Rx from 'rxjs/Rx';

const _ = require('lodash');

function isNull(v) {
    return v === null || typeof v === 'undefined' || v === undefined || v === 'undefined';
}

export default class TableRow extends Component {

    constructor(props) {
        super(props);

        this.state = {
            index: props.index,
            selected: props.selected,
            expanded: false,
            columnsIndex: props.columnsIndex,
            object: _.assign(props.object, props.changes),
            getUniqueKey: props.getUniqueKey,
            filter: props.filter,
            expansion: null
        }
    }

    /*
     LIFECYCLE FUNCTIONS
     */

    componentWillReceiveProps(nextProps) {
        // filter changed, but object remains the same 
        if(_.isEqual(this.props.object, nextProps.object) && !_.isEqual(this.props.filter, nextProps.filter)) 
            this.setState({index: nextProps.index, filter: nextProps.filter})
        // new data set
        else if(!_.isEqual(this.props.object, nextProps.object))
            this.setState({
                index: nextProps.index, object: _.assign(nextProps.object, nextProps.changes), 
                getUniqueKey: nextProps.getUniqueKey, expansion: null, expanded: false
            })

    }

    shouldComponentUpdate(nextProps, nextState) {
        return  !_.isEqual(this.state, nextState) ||
            !_.isEqual(this.props.filter, nextProps.filter) ||
            !_.isEqual(this.props.object, nextProps.object);
    }

    /*
     RENDER FUNCTION
     */
    render() {
        return this.props.filterObject(this.state.object)? 
            <div className="values-container">
                <Row id={`values-row-${this.state.index}`} ref={(ref) => this.tableRow = ref} className={`values-row ${this.state.expanded? 'expanded' : ''}`}>
                {
                    _.reduce(_.values(_.pick(_.zip(_.keys(this.state.object), _.values(this.state.object)), this.state.columnsIndex)), (acc, value, l) =>
                        acc.concat(
                            <Col className={`${_.isEqual(this.state.columnsIndex.length - 1, l)? 'last-child': ''} `} 
                                md={this.props.cols} sm={this.props.cols} xs={this.props.cols} onClick={this.onClick.bind(this)}>
                                {_.isArray(value[1])? value[1].join(', ') : isNull(value[1])? '' : _.get(this.props.keysDisplayFunction, `${value[0]}`, (v) => `${v}`)(value[1]) }
                            </Col>)
                    , []) 
                }
                </Row>
                <Row className={`expansion ${this.state.expanded? 'show' : ''}`} onClick={this.onClick.bind(this)}>
                    <div className="expansion-header">Runways</div>
                    {this.state.expansion}
                </Row>
            </div>
            :
            null
    }

    /*
    COMPONENT FUNCTIONS
     */


    onClick() {
        this.setState({expanded: !this.state.expanded}, () => {
            if(this.state.expanded) 
                this.props.onClick(this.state.getUniqueKey(this.state.object)).subscribe((expansion) =>
                    this.setState({expansion})
                )
        });

    }

}