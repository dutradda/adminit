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
import PropertiesViewArray from './PropertiesViewArray'

export default class PropertiesViewArrayObjects extends PropertiesViewArray {
    static defaultProps = {
        simpleProperties: [],
        objectProperties: [],
        size: 1
    };

    _buildItemProperties() {
        let itemProperties = []

        for (let item of this.props.items)
            itemProperties.push({
                titleTemplate: this.props.itemTitleTemplate,
                initExpanded: this._buildInitExpanded(this.props.itemsInitExpanded),
                name: this._getItemName(item),
                expandable: true,
                simpleProperties: this.props.simpleProperties,
                itemProperties: this._buildObjectProperties(item),
                size: 1,
                cardTextStyle: this.cardTextStyle,
                subtitleStyle: {}
            })

        return itemProperties
    }

    _buildObjectProperties(item) {
        let objectProperties = []

        for (let objectProp of this.props.objectProperties)
            objectProperties.push({
                initExpanded: true,
                expandable: false,
                titleTemplate: objectProp.titleTemplate,
                children: this._buildObjectChild(objectProp, item),
                cardStyle: {
                    backgroundColor: 'white',
                    marginBottom: '1em',
                    marginTop: '1em'
                },
                cardHeaderStyle: {
                    fontWeight: 'bold',
                    marginBottom: '-3.5em'
                },
                cardTextStyle: {marginBottom: '-1.5em'},
                size: 1
            })

        return objectProperties
    }

    _buildObjectChild(objectProp, item) {
        return (
            <p style={{fontSize: this.rowStyle.fontSize, whiteSpace: this.rowStyle.whiteSpace}}>
                {this._getPropertyValue(objectProp, item)}
            </p>
        )
    }
}
