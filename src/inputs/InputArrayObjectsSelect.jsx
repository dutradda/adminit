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
    TableRowColumn
} from 'material-ui/Table'
import RaisedButton from 'material-ui/RaisedButton'
import InputArraySelect from './InputArraySelect'
import InputSelect from './InputSelect'
import ItemEditor from '../editors/ItemEditor'

export default class InputArrayObjectsSelect extends InputArraySelect {
    static propTypes = {
        items: PropTypes.array.isRequired,
        select : PropTypes.object.isRequired,
        handleRemoveItem: PropTypes.func.isRequired,
        handleAddItem: PropTypes.func.isRequired,
        label: PropTypes.string.isRequired,
        addItemButtonLabel: PropTypes.string.isRequired,
        properties: PropTypes.array.isRequired,
        cardStyle: PropTypes.object,
        itemCardStyle: PropTypes.object,
        tableStyle: PropTypes.object,
        disableAddButtom: PropTypes.bool,
        maxItems: PropTypes.object.isRequired
    };

    static defaultProps = {
        items: [],
        cardStyle: {
            backgroundColor: 'white',
            width: '80%',
            marginTop: '1em'
        },
        tableStyle: {
            backgroundColor: 'white'
        },
        itemCardStyle: {
            backgroundColor: 'white',
            width: '80%',
            marginBottom: '1em'
        }
    };

    _getNewObject() {
        return (
            <div>
                <InputSelect
                {...this.props.select}
                onChange={this.props.handleAddItem}
                />
                <br /><br />
                <RaisedButton
                    primary={true}
                    label={this.props.addItemButtonLabel}
                    onTouchTap={this.props.handleAddItem}
                    disabled={this.props.items.length === this.props.maxItems.value}
                />
            </div>
        )
    }

    _getTableRows() {
        let viewRows = []
        let counter = 0

        for (let item of this.props.items) {
            viewRows.push(
                <TableRow key={counter++}>
                    <TableRowColumn style={{fontSize: '1em'}}>
                        <br />
                        <ItemEditor
                            item={item}
                            isRemovable={true}
                            handleRemove={this.props.handleRemoveItem}
                            inputs={this._getInputs(item)}
                            size={0}
                            cardStyle={this.props.itemCardStyle}
                        />
                        <br />
                    </TableRowColumn>
                </TableRow>
            )
        }

        return viewRows
    }

    _getInputs(item) {
        let newProperties = []

        for (let prop of this.props.properties)
            newProperties.push(Object.assign({}, prop, {onChange: prop.onChange(item)}))

        return newProperties
    }
}
