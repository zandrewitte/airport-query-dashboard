import React, { Component, PropTypes } from 'react'
import InputBox from './input-box';
import TableHeader from './table-header';
import TableRow from './table-row';
import {naturalSorter, isNull} from '../utils/common';

const _ = require('lodash');

export default class TableComponent extends Component {

    constructor(props) {
        super(props);

        let data = _.chunk(this._sortData(_.get(this.props, 'data', []), props.defaultSortColumn, 1), 50);

        this.state = {
            columnsIndex: !isNull(props.defaultIndexes) ? props.defaultIndexes : _.keys(_.get(this.props, 'headers', [])).map(v => Number(v)),
            data: _.head(data) || [],
            dataPointer: 0,
            _data: _.cloneDeep(data),
            filter: '',
            headers: props.headers,
            sortColumnPaths: props.sortColumnPaths,
            sortColumn: props.defaultSortColumn,
            sortDirection: 1,
            getUniqueKey: (object) => !isNull(object) ? _.isFunction(props.uniqueKey)? props.uniqueKey(object) : _.get(object, props.uniqueKey, '') : null 
        };
    }

    /*
     LIFECYCLE FUNCTIONS
     */

    /*COMPONENT LIFECYCLE FUNCTIONS*/
    componentWillReceiveProps(nextProps) {
        let getNextUniqueKey = (object) => !isNull(object) ? _.isFunction(nextProps.uniqueKey)? nextProps.uniqueKey(object) : _.get(object, nextProps.uniqueKey, '') : null

        let data = _.chunk(this._sortData(_.get(nextProps, 'data', []), this.state.sortColumn, this.state.sortDirection), 50);

        this.setState({
            data: _.head(data) || [],
            _data: _.cloneDeep(data),
            getUniqueKey: getNextUniqueKey
        });
    }

    /*
     RENDER FUNCTION
     */
    render() {
        // var self = this;
        //TODO: Allow for more than 12 cols / values -- currently using the bootstrap col sizes
        let calcCol = Math.round(12/this.state.headers.length);
        let cols = calcCol <= 2? 3 : calcCol;

        return (
            <div>
                <div className="admin-table">
                    <InputBox id={(input) => this[this.props.id + '_inputInternal'] = input} 
                        value={this.state.filter} changeDelay={true}
                        onChange={this.handleChange.bind(this)} placeholder={'Search'} />
                    <div className="table-container">
                        <TableHeader headers={this.state.headers} cols={cols} columnsIndex={this.state.columnsIndex} 
                            sortColumnIndex={this.state.sortColumnPaths.findIndex(v => this.state.sortColumn)} 
                            sortColumnPaths={this.state.sortColumnPaths} sortData={this.sortData.bind(this)} />
                        {
                            this.state.data.map( (obj, i) => {
                                let object = _.omit(obj, this.state.ignoreFields);
                                let uniqueKey = this.state.getUniqueKey(object);

                                return <TableRow index={i} onClick={this.props.onClick}
                                    object={object} getUniqueKey={this.state.getUniqueKey}
                                    columnsIndex={this.state.columnsIndex} cols={cols} filter={this.state.filter} 
                                    filterObject={this.filterObject.bind(this)} keysDisplayFunction={this.props.keysDisplayFunction} />
                            })
                        }
                    </div>
                    <div className="pagination">
                        <span onClick={() => this.handlePagination(-1)} className={this.state.dataPointer === 0? 'invisible' : ''}>{'<'}</span> 
                        <span onClick={() => this.handlePagination(-10)} className={(this.state.dataPointer-10) < 0 ? 'invisible' : ''}>{'<10'}</span> 
                        <span className="current-position">Page {this.state.dataPointer+1} of {this.state._data.length-1}</span>
                        <span onClick={() => this.handlePagination(10)} className={((this.state.dataPointer+10)) > this.state._data.length ? 'invisible' : ''}>{'>10'}</span> 
                        <span onClick={() => this.handlePagination(1)} className={this.state.dataPointer === this.state._data.length? 'invisible' : ''}>{'>'}</span> 
                    </div>
                </div>
            </div>
        );
    }

    /*
    COMPONENT FUNCTIONS
     */
    handlePagination(update) {
        let dataPointer = this.state.dataPointer + update;
        this.setState({
            dataPointer, 
            data: this._sortData(_.get(this.state._data, `${dataPointer}`, []), this.state.sortColumn, this.state.sortDirection)
        });
    }

    handleChange(filter) {
        this.setState({filter});
    }

    sortData(columnPath, direction) {
        let data = this.state.data.sort(function(a, b) {
            let aCol = _.get(a, columnPath, ' ');
            let bCol = _.get(b, columnPath, ' ');

            let valA = isNull(aCol)? ' ' : _.isArray(aCol)? _.isEmpty(aCol)? ' ' : aCol.join(',') : aCol;
            let valB = isNull(bCol)? ' ' : _.isArray(bCol)? _.isEmpty(bCol)? ' ' : bCol.join(',') : bCol;
            return (naturalSorter(`${valA}`, `${valB}`) * direction);
        }.bind(this));

        this.setState({sortColumn: columnPath, sortDirection: direction, data});
    }

    _sortData(data, columnPath, direction) {
        return data.sort((a, b) => {
            let aCol = _.get(a, columnPath, ' ');
            let bCol = _.get(b, columnPath, ' ');

            let valA = isNull(aCol)? ' ' : _.isArray(aCol)? _.isEmpty(aCol)? ' ' : aCol.join(',') : aCol;
            let valB = isNull(bCol)? ' ' : _.isArray(bCol)? _.isEmpty(bCol)? ' ' : bCol.join(',') : bCol;
            return (naturalSorter(`${valA}`, `${valB}`) * direction);
        });
    }

    filterObject(object) {
        return _.some(this.state.sortColumnPaths, key => {
            let value = _.get(object, key);
            return isNull(value)?  false : _.isArray(value) ? 
                value.some((v) => v.toUpperCase().includes(`${this.state.filter}`.toUpperCase()))
                :
                `${_.get(this.props.keysDisplayFunction, key, (v) => `${_.get(v, key)}`)(object)}`.toUpperCase().includes(`${this.state.filter}`.toUpperCase())
        });
    }

}