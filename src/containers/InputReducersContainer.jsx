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

import HttpContainer from './HttpContainer'

export default class InputReducersContainer extends HttpContainer {
    removeItemArrayReducer(previousState, action) {
        let buildNewState = (previousState, action) => {
            let value = this._getPropertyValue(action.input, previousState, false)
            let index = value.indexOf(action.value)

            if (index > -1)
                value.splice(index, 1)

            return this._buildInputNewState(action, value)
        }
        return this._reducerBase(previousState, action, 'REMOVE_FROM_ARRAY', buildNewState)
    }

    _buildInputNewState(action, value) {
        let newState = {}
        newState[action.input.name] = value
        return newState
    }

    addItemArrayReducer(previousState, action) {
        let buildNewState = (previousState, action) => {
            let newItem = action.value === undefined ? {} : action.value

            let value = this._getPropertyValue(action.input, previousState, false)
            if (value === undefined)
                value = []

            value.push(newItem)

            return this._buildInputNewState(action, value)
        }
        return this._reducerBase(previousState, action, 'ADD_TO_ARRAY', buildNewState)
    }
}
