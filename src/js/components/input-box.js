import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';
import {FormGroup, FormControl, ControlLabel} from 'react-bootstrap';
import Rx from 'rxjs/Rx';

const _ = require('lodash');

function isNull(v) {
    return v === null || typeof v === 'undefined' || v === undefined || v === 'undefined';
}

export default class InputBox extends Component {

    constructor(props) {
        super(props);

        this.eventSub = new Rx.Subject();

        this.state = {
            id: _.uniqueId(),
            value: !isNull(props.value) ? props.value : '',
        }

    }

    /*COMPONENT LIFECYCLE FUNCTIONS*/
    componentDidMount() {
        this.eventSub
            .do(value => this.setState({value}))
            .debounceTime(500)
            .scan((acc, curr) => curr, '')
            .distinctUntilChanged()
            .subscribe(this.props.onChange); // Only if the value has changed
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            value: !isNull(nextProps.value) ? nextProps.value : '',
        });
    }

    /*COMPONENT RENDER FUNCTION*/
    render() {
        return (
            <FormGroup controlId={this.state.id}>
                {!isNull(this.props.label)? <ControlLabel>{this.props.label}</ControlLabel> : null }
                <FormControl ref='refTextField' onBlur={_.isFunction(this.props.onBlur) ? (e) => this.props.onBlur(e.target.value) : () => null} 
                onChange={_.isFunction(this.props.onChange) ? (e) => this.eventSub.next(e.target.value) : () => null} 
                value={this.state.value} componentClass={this.props.componentClass} placeholder={this.props.placeholder}
                disabled={isNull(this.props.disabled) ? false : this.props.disabled} className={this.props.className || ''} />
            </FormGroup>
        );
    }
}