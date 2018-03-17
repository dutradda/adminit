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
  TableRow,
  TableRowColumn,
  TableHeader,
  TableHeaderColumn
} from 'material-ui/Table'
import PropertiesViewSimple from './PropertiesViewSimple'
import ItemView from './ItemView'

export default class PropertiesViewArrayInline extends PropertiesViewSimple {
    static propTypes = {
        properties: PropTypes.array,
        items: PropTypes.array.isRequired,
        initExpanded: PropTypes.bool,
        expandable: PropTypes.bool,
        titleTemplate: PropTypes.object,
        size: PropTypes.number,
        name: PropTypes.string,
        onRemoveItem: PropTypes.func
    }

    render() {
        if (this.props.titleTemplate === undefined)
            return super.render()

        if (this.props.items.length === 0)
            return null

        return (
            <div>
                <br />
                <ItemView
                    item={{}}
                    titleTemplate={this.props.titleTemplate}
                    expandable={this.props.expandable}
                    initExpanded={this.props.initExpanded}
                    size={1}
                    cardHeaderStyle={{
                        fontWeight: 'bold',
                        paddingBottom: '0.5em'
                    }}
                    cardTextStyle={{
                        marginTop: '-1.5em',
                        marginBottom: '-0.9em'
                    }}
                    cardStyle={{
                        backgroundColor: 'white',
                        display: 'inline-block'
                    }}
                >
                    {super.render()}
                </ItemView>
            </div>
        )
    }

    _getTableHeaders() {
        if (this.props.properties)
            return (
                <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                    <TableRow style={this.rowStyle}>
                        {this._getTableHeadersColumns()}
                    </TableRow>
                </TableHeader>
            )
        else
            return null
    }

    _getTableHeadersColumns() {
        let headers = []
        let counter = 0

        for (let property of this.props.properties)
            headers.push(
                <TableHeaderColumn  style={this.rowStyle} key={counter++}>
                    {property.display}
                </TableHeaderColumn>
            )

        this._addOthersHeaderColumns(headers)

        return headers
    }

    _getTableRows() {
        let viewRows = []
        let counter = 0

        for (let item of this.props.items) {
            let rowColumns = []
            let itemKey = `${counter}.item`

            if (this.props.properties)
                for (let property of this.props.properties) {
                    let columnContent = this._getTableRowColumnPropertyContent(item, property)
                    itemKey = itemKey.concat(`.${columnContent}`)

                    rowColumns.push(
                        <TableRowColumn key={itemKey} style={this.rowStyle}>
                            {columnContent}
                        </TableRowColumn>
                    )
                }

            else {
                item = this._castJson(item)

                rowColumns.push(
                    <TableRowColumn key={itemKey} style={this.rowStyle}>
                        {this._getTableRowColumnContent(item)}
                    </TableRowColumn>
                )
            }

            this._addOthersRowColumns(rowColumns, item)

            viewRows.push(
                <TableRow key={counter++} style={this.rowStyle}>
                    {rowColumns}
                </TableRow>
            )
        }

        return viewRows
    }

    _getTableRowColumnPropertyContent(value, property) {
        return this._getPropertyValue(property, value)
    }

    _getTableRowColumnContent(value) {
        return value
    }

    _addOthersHeaderColumns(headers) {}

    _addOthersRowColumns(rowColumns, item) {}
}
