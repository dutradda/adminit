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
import {Provider} from 'react-redux'
import BaseView from '../views/BaseView'
import {raiseNotImplementedError} from '../utils'
import { combineReducers, createStore } from 'redux'

export default class ContainerBase extends BaseView {
    componentWillMount() {
        this._bindMethods()
        this._setInitialState()
        this._setHttpClient()
        this._setInitializers()
        this._setReducers()
    }

    _setInitialState() {
        this.initialState = {}
    }

    _setHttpClient() {
        raiseNotImplementedError(this, this._setHttpClient)
    }

    _bindMethods() {
        this._getOwnProps = this._getOwnProps.bind(this)

        for (let propName of this._getOwnProps())
            if (this[propName] instanceof Function && propName !== 'constructor')
                this[propName] = this[propName].bind(this)
    }

    _getOwnProps(prototype, ownProps) {
        if (prototype === undefined)
            prototype = Object.getPrototypeOf(this)

        if (ownProps === undefined)
            ownProps = []

        let parentPrototype = Object.getPrototypeOf(prototype)

        if (parentPrototype.constructor === React.Component)
            return this._unique(ownProps)

        else {
            let parentProps = Object.getOwnPropertyNames(prototype)
            ownProps = parentProps.concat(ownProps)

            return this._getOwnProps(parentPrototype, ownProps)
        }
    }

    _unique(array) {
        let uniqueArray = []

        for (let item of array)
            if (uniqueArray.indexOf(item) === -1)
                uniqueArray.push(item)

        return uniqueArray
    }

    _setInitializers() {
        this.initializers = []
    }

    _setReducers() {
        this.reducers = {}
    }

    _setReduxStore() {
        let combinedReducers = combineReducers(this.reducers)
        this.reduxStore = createStore(combinedReducers)
    }

    componentDidMount() {
        for (let initializer of this.initializers)
            initializer()
    }

    render() {
        return (
            <Provider store={this.reduxStore}>
                {this._render()}
            </Provider>
        )
    }
}
