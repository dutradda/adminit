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
import {Card, CardText, CardHeader} from 'material-ui/Card'
import RaisedButton from 'material-ui/RaisedButton'
import BaseView from '../views/BaseView'
import PropertiesInputArrayInline from './PropertiesInputArrayInline'
import InputSelect from './InputSelect'

export default class InputArrayInline extends BaseView {
    static propTypes = {
        items: PropTypes.array,
        properties: PropTypes.array.isRequired,
        addItemButtonLabel: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        handleRemoveItem: PropTypes.func.isRequired,
        handleAddItem: PropTypes.func.isRequired,
        select: PropTypes.object,
        cardStyle: PropTypes.object
    };

    static defaultProps = {
        items: [],
        cardStyle: {
            backgroundColor: 'white',
            display: 'inline-block',
            marginTop: '1em'
        }
    };

    render() {
        return (
            <div>
                <br/>
                <Card
                    style={this.props.cardStyle}
                    initiallyExpanded={true}
                >
                    <CardHeader
                        titleStyle={{fontSize: '1.2em', marginBottom: '1em'}}
                        title={this.props.label}
                    />
                    <CardText
                        expandable={false}
                        style={{marginTop: '-4em'}}
                    >
                        {this._getOldObjects()}
                        {this._getNewObject()}
                    </CardText>
                </Card>
            </div>
        )
    }

    _getOldObjects() {
        return (
            <div>
                <br/>
                <PropertiesInputArrayInline 
                    items={this.props.items}
                    properties={this.props.properties}
                    onRemoveItem={this.props.handleRemoveItem}
                />
            </div>
        )
    }

    _getNewObject() {
        return (
            <div>
                {this._getItemsSelect()}
                <br/>
                <RaisedButton
                    label={this.props.addItemButtonLabel}
                    primary={true}
                    onTouchTap={this.props.handleAddItem}
                />
            </div>
        )
    }

    _getItemsSelect() {
        if (this.props.select) {
            return (
                <div style={{marginTop: '-1.5em'}}>
                    <InputSelect
                        {...this.props.select}
                        onChange={this.props.handleAddItem}
                    />
                    <br/>
                </div>
            )

        } else
            return null
    }
}
