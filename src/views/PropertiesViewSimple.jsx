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
import BaseView from './BaseView'

export default class PropertiesViewSimple extends BaseView {
    static propTypes = {
        config: PropTypes.array.isRequired,
        item: PropTypes.oneOfType([
            PropTypes.object.isRequired,
            PropTypes.array.isRequired
        ]),
        size: PropTypes.number
    }

    render() {
        let rows = this._getTableRows()

        if (rows.length > 0)
            return (
                <Table
                    fixedHeader={false}
                    selectable={false}
                    style={{backgroundColor: 'white', width: undefined}}
                >
                    {this._getTableHeaders()}
                    <TableBody displayRowCheckbox={false}>
                        {rows}
                    </TableBody>
                </Table>
            )
        else
            return null
    }

    _getTableHeaders() {
        return null
    }

    _getTableRows() {
        let rowBoldStyle = Object.assign({fontWeight: 'bold'}, this.rowStyle)
        let viewRows = []

        for (let property of this.props.config) {
            let value = this._getPropertyValue(property, this.props.item)
            let displayRow = this._getDisplayRow(property)

            viewRows.push(
                <TableRow key={property.name} style={this.rowStyle}>
                    {displayRow}
                    <TableRowColumn style={(displayRow === null) ? this.rowStyle : rowBoldStyle}>
                        {value}
                    </TableRowColumn>
                </TableRow>
            )
        }

        return viewRows
    }

    _getDisplayRow(property) {
        if (property.display)
            return (
                <TableRowColumn style={this.rowStyle}>
                    {property.display}
                </TableRowColumn>
            )
        else
            return null
    }
}
