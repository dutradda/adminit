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
import {TableHeaderColumn, TableRowColumn} from 'material-ui/Table'
import TextField from 'material-ui/TextField'
import Checkbox from 'material-ui/Checkbox'
import CheckboxChecked from 'material-ui/svg-icons/toggle/check-box'
import CheckboxOutline from 'material-ui/svg-icons/toggle/check-box-outline-blank'
import FlatButton from 'material-ui/FlatButton'
import ActionDelete from 'material-ui/svg-icons/action/delete'
import InputSelect from './InputSelect'
import PropertiesViewArrayInline from '../views/PropertiesViewArrayInline'

export default class PropertiesInputArrayInline extends PropertiesViewArrayInline {
    _getTableRowColumnPropertyContent(value, propInput) {
        let propertyValue = this._getPropertyValue(propInput, value, !propInput.parseJson)

        if (propInput.type === 'text') {
            return <TextField
                onChange={propInput.onChange(value)}
                value={propertyValue === undefined ? '' : propertyValue}
                disabled={propInput.disabled}
                style={{
                    width: propInput.width,
                    fontSize: `${this.fontSize}em`
                }}
                id={propInput.name + value}
            />

        } else if (propInput.type === 'select') {
            return <InputSelect
                {... propInput.select}
                getItems={propInput.getItems}
                getItemsToRemove={propInput.getItemsToRemove}
                onChange={propInput.onChange(value)}
                value={propertyValue}
                style={{width: propInput.width}}
            />

        } else if (propInput.type === 'boolean') {
            if (propInput.startsChecked === true && propertyValue === undefined)
                propertyValue = true
            else
                propertyValue = propertyValue === undefined ? false : JSON.parse(propertyValue)

            return <div style={{paddingLeft: '1em', width: '1em'}}>
                <Checkbox
                    checkedIcon={<CheckboxChecked style={{width: '1.7em'}}/>}
                    uncheckedIcon={<CheckboxOutline style={{width: '1.7em'}}/>}
                    defaultChecked={propertyValue}
                    onCheck={propInput.onChange(value, propInput.name)}
                />
            </div>
        }
    }

    _addOthersHeaderColumns(headers) {
        let style = Object.assign({textAlign: 'center'}, this.rowStyle)
        headers.push(
            <TableHeaderColumn  style={style} key={'removeHeader'}>
                {'Remove'}
            </TableHeaderColumn>
        )
    }

    _addOthersRowColumns(rowColumns, item) {
        rowColumns.push(
            <TableRowColumn key={'removeButton'} style={this.rowStyle}>
                <FlatButton
                    icon={<ActionDelete color="#F84032"/>}
                    onTouchTap={this.props.onRemoveItem(item)}
                />
            </TableRowColumn>
        )
    }

    constructor(props) {
        super(props)
        this.rowStyle = Object.assign({
                paddingLeft: '0.8em',
                paddingRight: '0.8em'
            },
            this.rowStyle
        )
    }
}
