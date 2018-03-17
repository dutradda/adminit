/* MIT License

  Copyright (c) 2017 Diogo Dutra

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE. */

import React from 'react'
import PropTypes from 'prop-types'
import {
    Table,
    TableBody,
    TableRow,
    TableRowColumn
} from 'material-ui/Table'
import FlatButton from 'material-ui/FlatButton'
import ActionDelete from 'material-ui/svg-icons/action/delete'
import InputArrayInline from './InputArrayInline'
import InputSelect from './InputSelect'

export default class InputArraySelect extends InputArrayInline {
    static propTypes = {
        items: PropTypes.array.isRequired,
        select : PropTypes.object.isRequired,
        handleRemoveItem: PropTypes.func.isRequired,
        handleAddItem: PropTypes.func.isRequired,
        displayTemplate: PropTypes.object.isRequired,
        tableStyle: PropTypes.object,
        cardStyle: PropTypes.object
    };

    static defaultProps = {
        tableStyle: {
            backgroundColor: 'white',
            width: undefined
        },
        cardStyle: {
            backgroundColor: 'white',
            display: 'inline-block',
            marginTop: '1em'
        }
    };

    _getNewObject() {
        return <InputSelect
            {...this.props.select}
            displayTemplate={this.props.displayTemplate}
            onChange={this.props.handleAddItem}
        />
    }

    _getOldObjects() {
        let rows = this._getTableRows()

        if (rows.length > 0)
            return (
                <div>
                    <br/><br/>
                    <Table
                        fixedHeader={false}
                        selectable={false}
                        style={this.props.tableStyle}
                    >
                        <TableBody displayRowCheckbox={false}>
                            {rows}
                        </TableBody>
                    </Table>
                </div>
            )
        else
            return null
    }

    _getTableRows() {
        let viewRows = []
        let counter = 0

        for (let item of this.props.items) {
            viewRows.push(
                <TableRow key={counter++}>
                    <TableRowColumn style={{fontSize: '1em'}}>
                        {this._processTextTemplate(item, this.props.displayTemplate)}
                    </TableRowColumn>
                    <TableRowColumn>
                        <FlatButton
                            label="REMOVE"
                            labelStyle={{fontSize: '0.9em', color: '#F84032'}}
                            icon={<ActionDelete color="#F84032"/>}
                            onTouchTap={this.props.handleRemoveItem(item)}
                        />
                    </TableRowColumn>
                </TableRow>
            )
        }

        return viewRows
    }
}
