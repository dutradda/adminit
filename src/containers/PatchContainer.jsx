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

import InputsContainer from './InputsContainer'
import {raiseNotImplementedError} from '../utils'

export default class PatchContainer extends InputsContainer {
    _buildPatch() {
        let patch = {}
        let result = null

        for (let input of this.inputs) {
            let type = input.type

            if (type === 'text' || type === 'select' || type === 'boolean' || type === 'password')
                result = this._applySimplePatch(patch, input)

            else if (type === 'arraySelect')
                result = this._applyArraySelectPatch(patch, input)

            else if (type === 'arrayInline')
                result = this._applyArrayInlinePatch(patch, input)

            else if (type === 'arrayObjectsSelect')
                result = this._applyArrayObjectsSelectPatch(patch, input)

            if (result === null)
                return null
        }

        return this._setRecursiveProperties(patch, this.inputs)
    }

    _applySimplePatch(patch, input) {
        let state = this.reduxStore.getState()
        let initValue = this._getPropertyValue(input, state.initialInputValues, !input.parseValue, input.parseValue)
        let stateValue = this._getPropertyValue(input, state.inputValues, !input.parseValue, input.parseValue)

        if (stateValue !== undefined) {
            let isEqual = input.compare(initValue, stateValue)

            if (!isEqual)
                patch[input.name] = stateValue
        }
    }

    _applyArraySelectPatch(patch, input) {
        let state = this.reduxStore.getState()
        let addedItems = []
        let removedItems = []
        let initArray = this._getPropertyValue(input, state.initialInputValues, false)
        let stateArray = this._getPropertyValue(input, state.inputValues, false)

        this._applyAddedItemsArraySelectPatch(input, initArray, stateArray, addedItems)
        this._applyRemovedItemsArraySelectPatch(input, initArray, stateArray, removedItems)

        if (addedItems.length > 0 || removedItems.length > 0)
            patch[input.name] = addedItems.concat(removedItems)
    }

    _applyAddedItemsArraySelectPatch(input, initArray, stateArray, addedItems) {
        if (stateArray !== undefined)
            for (let stateArrayItem of stateArray) {
                let stateArrayItemKey = stateArrayItem[input.select.keyName]

                if (stateArrayItemKey !== undefined) {
                    let wasAdded = true
                    stateArrayItemKey = JSON.parse(stateArrayItemKey)

                    if (initArray !== undefined)
                        for (let initArrayItem of initArray)
                            if (initArrayItem[input.select.keyName] === stateArrayItemKey) {
                                wasAdded = false
                                break
                            }

                    if (wasAdded === true) {
                        let patchedItem = {}
                        patchedItem[input.select.keyName] = stateArrayItemKey
                        addedItems.push(patchedItem)
                    }
                }
            }
    }

    _applyRemovedItemsArraySelectPatch(input, initArray, stateArray, removedItems, operation = 'remove') {
        if (initArray !== undefined)
            for (let initArrayItem of initArray) {
                let wasRemoved = true
                let initArrayItemKey = initArrayItem[input.select.keyName]

                if (stateArray !== undefined)
                    for (let stateArrayItem of stateArray) {
                        let stateArrayItemKey = stateArrayItem[input.select.keyName]

                        if (stateArrayItemKey !== undefined) {
                            stateArrayItemKey = JSON.parse(stateArrayItemKey)

                            if (stateArrayItemKey === initArrayItemKey) {
                                wasRemoved = false
                                break
                            }
                        }
                    }

                if (wasRemoved === true) {
                    let patchedItem = {_operation: operation}
                    patchedItem[input.select.keyName] = initArrayItemKey
                    removedItems.push(patchedItem)
                }
            }
    }

    _applyArrayInlinePatch(patch, input, remove_operation = 'delete') {
        let state = this.reduxStore.getState()
        let addedItems = []
        let removedItems = []
        let updatedItems = []
        let initArray = this._getPropertyValue(input, state.initialInputValues, false)
        let stateArray = this._getPropertyValue(input, state.inputValues, false)

        this._applyAddedItemsArrayPatch(input, stateArray, addedItems)
        this._applyUpdatedItemsArrayPatch(input, initArray, stateArray, updatedItems)

        input.select = {keyName: input.keyName}
        this._applyAddedItemsArraySelectPatch(input, initArray, stateArray, addedItems)
        this._applyRemovedItemsArraySelectPatch(input, initArray, stateArray, removedItems, remove_operation)
        delete input.select

        if (addedItems.length > 0 || removedItems.length > 0 || updatedItems.length > 0)
            patch[input.name] = addedItems.concat(removedItems).concat(updatedItems)
    }

    _applyAddedItemsArrayPatch(input, stateArray, addedItems) {
        if (stateArray !== undefined)
            for (let stateArrayItem of stateArray) {
                let stateArrayItemKey = stateArrayItem[input.keyName]

                if (stateArrayItemKey === undefined) {
                    let patchedItem = {}

                    for (let propertyConfig of input.properties) {
                        let stateItemValue = stateArrayItem[propertyConfig.name]

                        if (stateItemValue !== undefined) {
                            if (propertyConfig.parseValue === true)
                                stateItemValue = JSON.parse(stateItemValue)

                            patchedItem[propertyConfig.name] = stateItemValue
                        }   
                    }

                    if (Object.keys(patchedItem).length > 0) {
                        patchedItem._operation = 'insert'
                        addedItems.push(patchedItem)
                    }
                }
            }
    }

    _applyUpdatedItemsArrayPatch(input, initArray, stateArray, updatedItems) {
        if (stateArray !== undefined)
            for (let stateArrayItem of stateArray) {
                let stateArrayItemKey = stateArrayItem[input.keyName]

                if (initArray !== undefined && stateArrayItemKey !== undefined)
                    for (let initArrayItem of initArray)
                        if (stateArrayItemKey === initArrayItem[input.keyName]) {
                            let patchedItem = {}

                            for (let propertyConfig of input.properties) {
                                let stateItemValue = stateArrayItem[propertyConfig.name]
                                let initItemValue = initArrayItem[propertyConfig.name]

                                if (stateItemValue !== undefined)
                                    if (propertyConfig.parseValue === true)
                                        stateItemValue = JSON.parse(stateItemValue)

                                if (initItemValue !== undefined)
                                    if (propertyConfig.parseValue === true && typeof initItemValue === 'string')
                                        initItemValue = JSON.parse(initItemValue)

                                if (stateItemValue !== undefined && initItemValue !== stateItemValue) {
                                    patchedItem[propertyConfig.name] = stateItemValue
                                }
                            }

                            if (Object.keys(patchedItem).length > 0) {
                                patchedItem._operation = 'update'
                                patchedItem[input.keyName] = stateArrayItemKey
                                updatedItems.push(patchedItem)
                            }

                            break
                        }
            }
    }

    _applyArrayObjectsSelectPatch(patch, input) {
        return this._applyArrayInlinePatch(patch, input, 'remove')
    }

    _handleError() {
        raiseNotImplementedError(this, this._handleError)
    }

    setInitialInputValuesReducer(state, action) {
        if (action.type === 'SET_INITIAL_INPUT_VALUES') {
            let newState = {initialInputValues: this._copyItem(action.value)}
            return this._buildNewState(state, newState)

        } else
            return this._buildNewState(state)
    }

    _copyItem(item) {
        let copiedItem = {}

        for (let prop in item)
            if (Array.isArray(item[prop])) {
                copiedItem[prop] = []

                for (let arrayItem of item[prop])
                    if (typeof arrayItem === 'object' && arrayItem !== null)
                        copiedItem[prop].push(this._copyItem(arrayItem))
                    else
                        copiedItem[prop].push(arrayItem)

            } else if (typeof item[prop] === 'object' && item[prop] !== null)
                copiedItem[prop] = this._copyItem(item[prop])

            else
                copiedItem[prop] = item[prop]

        return copiedItem
    };
}
