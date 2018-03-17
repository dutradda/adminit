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
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import BaseView from '../views/BaseView'

export default class InputSelect extends BaseView {
    static propTypes = {
        onChange: PropTypes.func.isRequired,
        label: PropTypes.string,
        keyName: PropTypes.string,
        getItems: PropTypes.func.isRequired,
        getItemsToRemove: PropTypes.func.isRequired,
        valueIsItem: PropTypes.bool,
        displayTemplate: PropTypes.object,
        value: PropTypes.node,
        labelStyle: PropTypes.object,
        style: PropTypes.object,
        underlineDisabledStyle: PropTypes.object,
        disabled: PropTypes.bool
    };

    static defaultProps = {}

    render() {
        let objects = this._getObjects()

        return (
            <SelectField
              onChange={this.props.onChange}
              disabled={objects.length === 0 || this.props.disabled}
              floatingLabelText={this.props.label}
              value={this.props.value}
              labelStyle={this.props.labelStyle}
              listStyle={{backgroundColor: 'white'}}
              style={this.props.style}
              underlineDisabledStyle={this.props.underlineDisabledStyle}
            >
                {objects}
            </SelectField>
        )
    }

    _getObjects() {
        let elements = []
        let keyName = this.props.keyName
        let displayTemplate = this.props.displayTemplate

        for (let object of this.props.getItems()) {
            let toAdd = true

            for (let objectToRemove of this.props.getItemsToRemove())
                if (!this.props.keyName) {
                    if (object === objectToRemove && objectToRemove !== this.props.value) {
                        toAdd = false
                        break
                    }

                } else if (objectToRemove[keyName] === object[keyName] && objectToRemove[keyName] !== this.props.value) {
                    toAdd = false
                    break
                }

            if (toAdd) {
                let value = (this.props.valueIsItem) ? object : object[keyName]
                let display = (displayTemplate) ? this._processTextTemplate(object, displayTemplate) : object
                elements.push(
                    <MenuItem
                        key={JSON.stringify(value)}
                        value={value}
                        primaryText={display}
                    />
                )
            }
        }

        return elements
    }
}
