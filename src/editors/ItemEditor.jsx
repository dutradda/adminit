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
import {Card, CardText, CardActions} from 'material-ui/Card'
import TextField from 'material-ui/TextField'
import FlatButton from 'material-ui/FlatButton'
import ActionDelete from 'material-ui/svg-icons/action/delete'
import muiThemeable from 'material-ui/styles/muiThemeable'
import Checkbox from 'material-ui/Checkbox'
import BaseEditor from './BaseEditor'
import InputSelect from '../inputs/InputSelect'
import InputArraySelect from '../inputs/InputArraySelect'
import InputArrayInline from '../inputs/InputArrayInline'
import InputArrayObjectsSelect from '../inputs/InputArrayObjectsSelect'


export default class ItemEditor extends BaseEditor {
    static propTypes = {
        item: PropTypes.object.isRequired,
        inputs: PropTypes.array.isRequired,
        isRemovable: PropTypes.bool,
        handleRemove: PropTypes.func,
        handleRemoveArrayItem: PropTypes.func,
        paperStyle: PropTypes.object,
        cardStyle: PropTypes.object,
        cardTextStyle: PropTypes.object,
        cardActionsStyle: PropTypes.object,
        size: PropTypes.number,
        isNewItem: PropTypes.bool
    };

    static defaultProps = {
        paperStyle: {
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column'
        },
        cardStyle: {
            backgroundColor: 'white',
            width: '80%',
            marginBottom: '1em'
        },
        size: -2
    };

    render() {
        return (
            <Card
                style={this.props.cardStyle}
                initiallyExpanded={true}
            >
                <CardText expandable={false} style={this.props.cardTextStyle}>
                    {this._getInputs()}
                    {this._getRemoveButton()}
                </CardText>
            </Card>
        )
    }

    _getInputs() {
        let inputElements = []
        let counter = 0

        for (let input of this.props.inputs) {
           let props = {}
           let element = null

            if (input.type === 'text' || input.type === 'password')
                element = this._getInputText(input, props)

            else if (input.type === 'select')
                element = this._getInputSelect(input, props)

            else if (input.type === 'arraySelect')
                element = this._getInputArraySelect(input, props)

            else if (input.type === 'arrayObjectsSelect')
                element = this._getInputArrayObjectSelect(input, props)

            else if (input.type === 'boolean')
                element = this._getInputBoolean(input, props)

            else if (input.type === 'arrayInline')
                element = this._getInputArrayInline(input, props)

            if (element !== null)
                inputElements.push(
                    <div key={counter++}>
                        {element}
                        <br />
                    </div>
                )
        }

        return inputElements
    }

    _getInputText(input, props) {
        if (input.disabled === true) {
            if (this.props.item[input.name] !== undefined)
                props.disabled = true
            else
                return null
        }

        props.onChange = input.onChange
        props.floatingLabelText = input.label
        props.value = this._getPropertyValue(input, this.props.item)
        props.inputStyle = input.inputStyle
        props.floatingLabelStyle = input.floatingLabelStyle
        props.style = {width: input.width, fontSize: this.rowStyle.fontSize}

        if (input.multiLine) {
            props.multiLine = true
            props.rows = 3
        }

        if (input.type === 'password')
            props.type = input.type

        if (this.props.isNewItem === false && input.disableOnEdit)
            props.disabled = true

        return <TextField {...props} />
    }

    _getInputSelect(input, props) {
        props.onChange = input.onChange
        props.label = input.label
        props.keyName = input.keyName
        props.getItems = input.getItems
        props.getItemsToRemove = input.getItemsToRemove
        props.valueIsItem = input.valueIsItem
        props.displayTemplate = input.displayTemplate
        props.value = this._getPropertyValue(input, this.props.item, false)
        props.style = {fontSize: this.rowStyle.fontSize}

        if (this.props.isNewItem === false && input.disableOnEdit)
            props.disabled = true

        if (input.disabled)
            props.disabled = true

        return <InputSelect {...props} />
    }

    _getInputArraySelect(input, props) {
        props.handleAddItem = input.handleAddArrayItem
        props.handleRemoveItem = input.handleRemoveArrayItem
        props.displayTemplate = input.displayTemplate
        props.label = input.label
        props.items = this._getPropertyValue(input, this.props.item, false)
        props.select = input.select

        if (props.items === undefined) {
            let newItem = {}
            newItem[input.name] = []
            newItem = this._setRecursiveProperties(newItem, [input])
            props.items = this._getPropertyValue(input, newItem, false)
            this.props.item[Object.keys(newItem)[0]] = newItem[Object.keys(newItem)[0]]
        }

        return <InputArraySelect {...props} />
    }

    _getInputArrayObjectSelect(input, props) {
        props.handleAddItem = input.handleAddArrayItem
        props.handleRemoveItem = input.handleRemoveArrayItem
        props.label = input.label
        props.items = this._getPropertyValue(input, this.props.item, false)
        props.select = input.select
        props.properties = input.properties
        props.addItemButtonLabel = input.addItemButtonLabel
        props.maxItems = input.maxItems

        if (props.items === undefined) {
            let newItem = {}
            newItem[input.name] = []
            newItem = this._setRecursiveProperties(newItem, [input])
            props.items = this._getPropertyValue(input, newItem, false)
            this.props.item[Object.keys(newItem)[0]] = newItem[Object.keys(newItem)[0]]
        }

        return <InputArrayObjectsSelect {...props} />
    }

    _getInputBoolean(input, props) {
        props.onCheck = input.onCheck
        props.label = input.label
        props.labelPosition = 'left'
        props.labelStyle = {fontSize: '1.15em'}
        props.style = {width: '20em', marginTop: '2em', marginBottom: '-1.5em'}

        let value = this.props.item[input.name]
        props.checked = value === true ? true : false

        if (this.props.isNewItem === false && input.disableOnEdit)
            props.disabled = true

        return <Checkbox {...props} />
    }

    _getInputArrayInline(input, props) {
        props.properties = input.properties
        props.label = input.label
        props.addItemButtonLabel = input.addItemButtonLabel
        props.items = this._getPropertyValue(input, this.props.item, false)
        props.handleAddItem = input.handleAddItem
        props.handleRemoveItem = input.handleRemoveItem
        props.select = input.select

        return <InputArrayInline {...props} />
    }

    _getRemoveButton() {
        if (this.props.isRemovable)
            return (
                <CardActions style={this.props.cardActionsStyle}>
                    <div>
                        <br/>
                        <RemoveRaisedButton
                            label="REMOVE"
                            onTouchTap={this.props.handleRemove(this.props.item)}
                        />
                    </div>
                </CardActions>
            )
        else
            return null
    }
}

class RemoveRaisedButton extends React.Component {
    render() {
        let color = this.props.muiTheme.palette.alertColor
        let style = {
            color: color,
            fontSize: '0.9em'
        }
        
        return <FlatButton
            labelStyle={style}
            label={this.props.label}
            icon={<ActionDelete color={color} />}
            onTouchTap={this.props.onTouchTap}
        />
    }
}

RemoveRaisedButton = muiThemeable()(RemoveRaisedButton)
