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
import RaisedButton from 'material-ui/RaisedButton'
import Paper from 'material-ui/Paper'
import BaseView from './BaseView'
import ItemView from './ItemView'

export default class ItemsListView extends BaseView {
    static propTypes = {
        collectionName: PropTypes.string.isRequired,
        itemName: PropTypes.string.isRequired,
        items: PropTypes.array,
        simpleProperties: PropTypes.array,
        itemProperties: PropTypes.array,
        arrayProperties: PropTypes.array,
        arrayInlineProperties: PropTypes.array,
        arrayObjectsProperties: PropTypes.array,
        objectProperties: PropTypes.array,
        handleCreateNewItem: PropTypes.func.isRequired,
        handleEditItem: PropTypes.func.isRequired,
        handleDeleteItem: PropTypes.func.isRequired,
        itemTitleTemplate: PropTypes.object.isRequired,
        itemSubtitleTemplate: PropTypes.object.isRequired,
        titleStyle: PropTypes.object.isRequired,
        contentStyle: PropTypes.object.isRequired
    };

    static defaultProps = {
        items: [],
        titleStyle: {
            textAlign: 'center'
        },
        contentStyle: {
            alignItems: 'center',
            display: 'flex',
            width: '100%',
            flexDirection: 'column'
        }
    }

    render() {
        return (
            <div>
                <Paper zDepth={0} style={this.props.contentStyle}>
                    {this._getListTitle()}
                    {this._getCreateNewItemButton()}
                    {this._getItems()}
                </Paper>
            </div>
        )
    }

    _getListTitle() {
        let collectionTitle = this._toUpperCase(this.props.collectionName)
        return (
            <h1 style={this.props.titleStyle}>
                {`${collectionTitle} LIST`}
            </h1>
        )
    }

    _getCreateNewItemButton() {
        let itemTitle = this._toUpperCase(this.props.itemName)

        return (
            <div>
                <RaisedButton
                    label={`CREATE NEW ${itemTitle}`}
                    primary={true}
                    onTouchTap={this.props.handleCreateNewItem}
                />
                <br/><br/><br/>
            </div>
        )
    }

     _getItems() {
        let items = []
        let counter = 0

        for (let item of this.props.items) {
            items.push(
                <ItemView
                    key={counter}
                    simpleProperties={this.props.simpleProperties}
                    itemProperties={this.props.itemProperties}
                    arrayProperties={this.props.arrayProperties}
                    arrayInlineProperties={this.props.arrayInlineProperties}
                    arrayObjectsProperties={this.props.arrayObjectsProperties}
                    objectProperties={this.props.objectProperties}
                    handleEditItem={this.props.handleEditItem}
                    handleDeleteItem={this.props.handleDeleteItem}
                    titleTemplate={this.props.itemTitleTemplate}
                    subtitleTemplate={this.props.itemSubtitleTemplate}
                    expandable={true}
                    showCardActions={true}
                    item={item}
                />
            )
            counter++
        }

        return items
    }
}
