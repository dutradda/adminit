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
import { Provider } from 'react-redux'
import SnackbarContainer from './SnackbarContainer'
import {ItemsListView} from '..'

export default class ListContainer extends SnackbarContainer {
    _bindMethods() {
        super._bindMethods()
        this.handleCreateNewItem = this.handleCreateNewItem.bind(this)
        this.handleDeleteItem = this.handleDeleteItem.bind(this)
        this.handleEditItem = this.handleEditItem.bind(this)
        this._handleSuccessDelete = this._handleSuccessDelete.bind(this)
    }

    handleCreateNewItem() {
        this.routePage(this.props.collectionName + '/new')
    }

    handleDeleteItem(item, successCb, failureCb) {
        let key = item[this.props.keyName]
        this.client.delete(
            this.props.collectionName + `/${key}`,
            this._handleSuccessDelete(successCb),
            this._handleHttpErrorMessage(failureCb)
        )
    }

    handleEditItem(item) {
        let key = item[this.props.keyName]
        this.routePage(this.props.collectionName + `/edit/${key}`)
    }

    _handleSuccessDelete(func) {
        return (response) => {
            func(response)
            setTimeout(() => this.reloadPage(), 200)
        }
    }

    _renderList() {
        return (
            <Provider store={this.reduxStore}>
                <ItemsListView
                    collectionName={this.props.collectionName}
                    itemName={this.props.itemName}
                    items={this.state[this.props.itemsStateKey]}
                    simpleProperties={this._buildSimpleProperties()}
                    itemProperties={this._buildItemProperties()}
                    arrayProperties={this._buildArrayProperties()}
                    arrayInlineProperties={this._buildArrayInlineProperties()}
                    arrayObjectsProperties={this._buildArrayObjectProperties()}
                    objectProperties={this._buildObjectProperties()}
                    handleEditItem={this.handleEditItem}
                    handleDeleteItem={this.handleDeleteItem}
                    handleCreateNewItem={this.handleCreateNewItem}
                    itemTitleTemplate={this.props.itemTitleTemplate}
                    itemSubtitleTemplate={this.props.itemSubtitleTemplate}
                />
            </Provider>
        )
    }

    _buildSimpleProperties() {}

    _buildItemProperties() {}

    _buildArrayProperties() {}

    _buildArrayInlineProperties() {}

    _buildArrayObjectProperties() {}

    _buildObjectProperties() {}
}
