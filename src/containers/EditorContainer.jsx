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
import ListContainer from './ListContainer'
import {ItemEditorView} from '..'

export default class EditorContainer extends ListContainer {
    _bindMethods() {
        super._bindMethods()
        this.handleApplyItem = this.handleApplyItem.bind(this)
        this.handleCancelItem = this.handleCancelItem.bind(this)
        this._getItem = this._getItem.bind(this)
        this._routeSuccess = this._routeSuccess.bind(this)
    }

    _setEditorInitializers() {
        this.initializers.push(this._getItem)
    }

    _setEditorActions() {
        super._setActions()
        this.actions.getItem = {
            stateKey: 'inputValues',
            reducers: [this._setStateValueReducer, this._setInitialInputValuesReducer],
        }
    }

    _renderEditor() {
        return (
            <Provider store={this.reduxStore}>
                <ItemEditorView
                    collectionName={this.props.collectionName}
                    itemName={this.props.itemName}
                    item={this.state.inputValues}
                    inputs={this.inputs}
                    handleApply={this.handleApplyItem}
                    handleCancel={this.handleCancelItem}
                    showTopCancelButton={this.props.showTopCancelButton}
                    isNewItem={this._isNewItem()}
                />
                {this._getSnackBar('alertColor')}
            </Provider>
        )
    }

    _getItem() {
        if (!this._isNewItem())
            this.client.get(
                this._getItemUrl(),
                this._QueueActionHttpResult(this.actions.getItem)
            )
    }

    _isNewItem() {        
        return this.props.match.url.endsWith('new')
    }

    _getItemUrl() {
        let key = this.props.match.params[this.props.keyName]
        return `${this.props.collectionName}/${key}`
    }

    handleApplyItem() {
        let patch = this._buildPatch()
        console.log(patch)

        if (this._isNewItem())
            this.client.post(
                this._getItemPostUrl(),
                this._routeSuccess,
                this._handleHttpErrorMessage(this.openSnackbar),
                JSON.stringify([patch])
            )
        else
            this.client.patch(
                this._getItemPatchUrl(),
                this._routeSuccess,
                this._handleHttpErrorMessage(this.openSnackbar),
                JSON.stringify(patch)
            )
    }

    _getItemPostUrl() {
        return this.props.collectionName
    }

    _routeSuccess() {
        this.routePage(`/${this.props.collectionName}`)
    }

    _getItemPatchUrl(patch) {
        return this._getItemUrl()
    }

    _showHttpError(message) {
        console.log(message)
    }

    handleCancelItem() {
        this.backPage()
    }
}
