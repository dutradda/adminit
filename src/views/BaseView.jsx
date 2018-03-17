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

export default class BaseView extends React.Component {
    static propTypes = {
        size: PropTypes.number
    };

    static defaultProps = {
        size: 0
    }

    _getPropertyValue(input, item = {}, cast = true, parse = false) {
        if (input.isRecursive) {
            let names = input.name.split('.')
            let propertyName = names[0]
            names = names.slice(1)
            input = {
                name: names.join('.'),
                isRecursive: names.length === 1 ? undefined : true
            }

            if (names.length !== 0)
                return this._getPropertyValue(input, item[propertyName], cast)
            else 
                return this._castJson(item[propertyName], cast, parse)

        } else
            return this._castJson(item[input.name], cast, parse)
    }

    _castJson(json, cast = true, parse = false) {
        json = (json === undefined && cast) ? '' : json

        if (cast && typeof json !== 'string')
            json = JSON.stringify(json, null, 4)

        else if (parse && typeof json === 'string')
            json = JSON.parse(json)

        return json
    }

    _buildInitExpanded(defaultValue) {
        return this.props.items.length === 1 && defaultValue !== false ? true : defaultValue
    }

    _processTextTemplate(item, template, uppercase) {
        let text = template.text.concat('')
        let value

        if (Array.isArray(template.placeholders))
            for (let key of template.placeholders) {
                value = this._getPropertyValue({name: key, isRecursive: true}, item, false)

                if (uppercase)
                    value = value.toUpperCase().replace('_', ' ')

                text = text.replace(`{${key}}`, value)
            }

        return text
    }

    _toUpperCase(text) {
        return text.toUpperCase().replace('_', ' ')
    }

    _setRecursiveProperties(patch, inputs) {
        let newPatch = Array.isArray(patch) ? [] : {}

        for (let propName in patch)
            for (let input of inputs)
                if (input.name === propName && input.isRecursive === true) {
                    let names = input.name.split('.')
                    let currentName = names.shift()
                    currentName = isNaN(currentName) ? currentName : JSON.parse(currentName)

                    let nextNameIsArray = !isNaN(names[0])

                    let inputName
                    if (names.length === 1 && nextNameIsArray)
                        inputName = JSON.parse(names[0])
                    else
                        inputName = names.join('.')

                    let currentPatch
                    if (newPatch[currentName] === undefined)
                        currentPatch = nextNameIsArray ? [] : {}
                    else
                        currentPatch = newPatch[currentName]

                    currentPatch[inputName] = patch[propName]

                    input = {
                        name: inputName,
                        isRecursive: names.length === 1 ? undefined : true
                    }

                    newPatch[currentName] = this._setRecursiveProperties(currentPatch, [input])

                    if (!input.isRecursive)
                        delete currentPatch[inputName]

                } else if (input.name === propName)
                    newPatch[propName] = patch[propName]

        return newPatch
    }

    constructor(props) {
        super(props)
        this.fontSize = 0.98 - (0.08*this.props.size)
        this.height = 2 - (0.5*this.props.size)
        this.rowStyle = {
            height: `${this.height}em`,
            fontSize: `${this.fontSize}em`,
            whiteSpace: 'pre'
        }
        this.iconStyle = (this.props.size === undefined || this.props.size === 0) ? {} : {width: 17, height: 17}
    }

    _calculateFontSize(size) {
        let fontSize = 0.98 - (0.08*size)
        return `${fontSize}em`
    }

    componentDidMount() {
        for (let prop in this.props)
            if (this.constructor.propTypes[prop] === undefined)
                console.warn(`Prop '${prop}' is not in propTypes of ${this.constructor.name}`)
    }
}
