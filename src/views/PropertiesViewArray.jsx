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
import BaseView from './BaseView'
import ItemView from './ItemView'

export default class PropertiesViewArray extends BaseView {
    static propTypes = {
        items: PropTypes.array.isRequired,
        initExpanded: PropTypes.bool,
        itemsInitExpanded: PropTypes.bool,
        titleTemplate: PropTypes.object.isRequired,
        itemTitleTemplate: PropTypes.object.isRequired,
        simpleProperties: PropTypes.array,
        arrayInlineProperties: PropTypes.array,
        name: PropTypes.string,
        isRecursive: PropTypes.bool,
        objectProperties: PropTypes.array,
        size: PropTypes.number
    };

    static defaultProps = {
        simpleProperties: [],
        arrayInlineProperties: []
    }

    render() {
        if (this.props.items.length > 0)
            return (
                <div>
                    <br />
                    <ItemView
                        itemProperties={this._buildItemProperties()}
                        initExpanded={this._buildInitExpanded(this.props.initExpanded)}
                        expandable={true}
                        item={this.props.items}
                        titleTemplate={this.props.titleTemplate}
                        cardTextStyle={this.cardTextStyle}
                    />
                </div>
            )
        else
            return null
    }

    _buildItemProperties() {
        let itemProperties = []

        for (let item of this.props.items)
            itemProperties.push({
                titleTemplate: this.props.itemTitleTemplate,
                initExpanded: this._buildInitExpanded(this.props.itemsInitExpanded),
                name: this._getItemName(item),
                expandable: true,
                simpleProperties: this.props.simpleProperties,
                arrayInlineProperties: this.props.arrayInlineProperties,
                size: 1,
                cardTextStyle: this.cardTextStyle,
                subtitleStyle: {}
            })

        return itemProperties
    }

    _getItemName(item) {
        return this.props.items.indexOf(item).toString()
    }

    constructor(props) {
        super(props)
        this.cardTextStyle = {
            marginTop: '-2em',
            marginBottom: '-1em',
        }
    }
}
