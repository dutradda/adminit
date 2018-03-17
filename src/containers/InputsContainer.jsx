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

import InputReducersContainer from './InputReducersContainer'
import InputText from '../inputs/InputText'
import InputBoolean from '../inputs/InputBoolean'
import InputSelect from '../inputs/InputSelect'
import InputArraySelect from '../inputs/InputArraySelect'
// import InputArrayInline from '../inputs/InputArrayInline'
// import InputArrayObjectsSelect from '../inputs/InputArrayObjectsSelect'
import { connect } from 'react-redux'

export default class InputsContainer extends InputReducersContainer {
    componentWillMount() {
        super.componentWillMount()
        this._setInputs()
        this._setInputsInternals()
        this._setReduxStore(this.reducers)
    }

    _setInputs() {
        this.inputs = {}
    }

    _setInputsInternals() {
        for (let inputName in this.inputs) {
            let input = this.inputs[inputName]
            input.name = inputName

            if (input.type === 'text' || input.type === 'password')
                this._setTextInputComponent(input)

            else if (input.type === 'boolean')
                this._setBooleanInputComponent(input)

            else if (input.type === 'select')
                this._setSelectInputComponent(input)

            else if (input.type === 'arraySelect')
                this._setArraySelectInputComponent(input)

            else if (input.type === 'arrayInline')
                this._setArrayInlineInputComponent(input)

            else if (input.type === 'arrayObjectsSelect')
                this._setArrayObjectsSelectInputComponent(input)

            if (input.compare === undefined)
                input.compare = (val1, val2) => val1 === val2
        }
    }

    _setTextInputComponent(input) {
        let stateMapper = (state) => {
            return this._buildValueStateMap(input, state)
        }
        let dispatchMapper = (dispatch) => {
            return {
                onChange: event => {
                    let action = this._buildSetValueAction(input.name, event.target.value)
                    dispatch(action)
                }
            }
        }
        this._setInputComponent(input, InputText, stateMapper, dispatchMapper)
        this.reducers[input.name] = this._buildReducer(input, '')
    }

    _buildValueStateMap(input, state, cast=true) {
        return {value: this._getPropertyValue(input, state, cast)}
    }

    _buildSetValueAction(type, value) {
        return {type, value}
    }

    _setInputComponent(input, component, stateMapper, dispatchMapper) {
        let mapStateToProps = (state, ownProps) => stateMapper(state, ownProps)
        let mapDispatchToProps = (dispatch, ownProps) => dispatchMapper(dispatch, ownProps)
        input.component = connect(mapStateToProps, mapDispatchToProps)(component)
    }

    _buildReducer(input, initialState=null) {
        if (input.initialState === undefined)
            input.initialState = initialState

        return (previousState, action) => {
            if (action.type === input.name) {
                if (input.reducer !== undefined)
                    input.reducer(action, input, previousState)

                return action.value

            } else if (previousState === undefined)
                return input.initialState

            else
                return previousState
        }
    }

    _setBooleanInputComponent(input) {
        let stateMapper = (state, ownProps) => {
            return this._buildValueStateMap(input, state)
        }
        let dispatchMapper = (dispatch, ownProps) => {
            return {
                onCheck: (event, isInputChecked) => {
                    let action = this._buildSetValueAction(input.name, isInputChecked)
                    dispatch(action)
                }
            }
        }
        this._setInputComponent(input, InputBoolean, stateMapper, dispatchMapper)
        this.reducers[input.name] = this._buildReducer(input, false)
    }

    _setSelectInputComponent(input) {
        let stateMapper = (state, ownProps) => {
            return {
                value: this._getPropertyValue(input, state),
                getItems: () => state[input.itemsStateKey],
                getItemsToRemove: () => state[input.itemsToRemoveStateKey],
                label: input.label,
                keyName: input.keyName,
                valueIsItem: input.valueIsItem,
                displayTemplate: input.displayTemplate,
                labelStyle: input.labelStyle,
                style: input.style,
                underlineDisabledStyle: input.underlineDisabledStyle,
                disabled: input.disabled
            }
        }

        let dispatchMapper = (dispatch, ownProps) => {
            return {
                onChange: (event, index, value) => {
                    let action = this._buildSetValueAction(input.name, value)
                    dispatch(action)
                }
            }
        }

        this._setInputComponent(input, InputSelect, stateMapper, dispatchMapper)
    }

    _setArraySelectInputComponent(input) {
        let stateMapper = this._buildInputArrayStateMapper(input)

        let dispatchMapper = (dispatch, ownProps) => {
            return {
                handleRemoveArrayItem: this._buildRemoveArrayItemDispatcher(input, dispatch, ownProps),
                handleAddArrayItem: this._buildAddArrayItemDispatcher(input, dispatch, ownProps)
            }
        }

        this._setInputComponent(input, InputArraySelect, stateMapper, dispatchMapper)
    }

    _buildInputArrayStateMapper(input) {
        return (state, ownProps) => {
            return {
                items: this._getPropertyValue(input, state, false),
                selectGetItems: () => state[input.selectItemsStateKey],
                selectGetItemsToRemove: () => state[input.selectItemsToRemoveStateKey],
                select: input.select,
                displayTemplate: input.displayTemplate,
                tableStyle: input.tableStyle,
                cardStyle: input.cardStyle
            }
        }
    }

    _buildRemoveArrayItemDispatcher(input, dispatch, ownProps) {
        return currentItem => {
            return () => {
                let action = this._buildInputAction(
                    'REMOVE_FROM_ARRAY', input, currentItem
                )
                dispatch(action)
            }
        }
    }

    _buildInputAction(type, input, value) {
        return {type, input, value}
    }

    _buildAddArrayItemDispatcher(input, dispatch, ownProps) {
        return (event, index, value) => {
            let action = this._buildInputAction(
                'ADD_TO_ARRAY', input, value
            )
            dispatch(action)
        }
    }

    _setArrayInlineInputComponent(input) {
        let stateMapper = this._buildInputArrayStateMapper(input)

        let dispatchMapper = (dispatch, ownProps) => {
            return {
                handleRemoveArrayItem: this._buildRemoveArrayItemDispatcher(input, dispatch, ownProps),
                handleAddArrayItem: this._buildAddArrayItemDispatcher(input, dispatch, ownProps)
            }
        }

        this._setInputComponent(input, InputArraySelect, stateMapper, dispatchMapper)

        input.handleRemoveItem = this._bindRemoveArrayItem(input)
        input.handleAddItem = this._bindAddArrayItem(input)

        if (input.select && input.selectItemsStateKey && input.selectItemsToRemoveStateKey)
            this._setArraySelectInputComponent(input)

        this._setInputPropertiesComponent(input)
    }

    _setArrayObjectsSelectInputComponent(input) {
        this._setArraySelectInputComponent(input)
        this._setInputPropertiesComponent(input)
    }

    _setInputPropertiesComponent(input) {
        for (let propInput of input.properties) {
            if (propInput.type === 'text') {
                propInput.onChange = this._bindInputTextArrayItemValue(propInput)
                propInput.reducers = [this._setInputArrayItemValueReducer]

            } else if (propInput.type === 'select') {
                propInput.reducers = [this._setInputArrayItemValueReducer]
                propInput.onChange = this._bindInputSelectArrayItemValue(propInput)
                propInput.getItems = () => this.state[propInput.selectItemsStateKey]
                propInput.getItemsToRemove = () => this.state[propInput.selectItemsToRemoveStateKey]

            } else if (propInput.type === 'boolean') {
                propInput.onChange = this._bindInputCheckBoxArrayItemValue(propInput)
                propInput.reducers = [this._setInputArrayItemValueReducer]
            }
        }
    }

    // _bindInputArraySelectValue(input) {
    //     return this._bindInputSelectValue(input)
    // }

    // _bindInputCheckBoxValue(input) {
    //     return (event, isInputChecked) => {
    //         this._queueAction(input, {value: isInputChecked})
    //     }
    // }

    // _setInitialState() {
    //     super._setInitialState()
    //     this.initialState.inputValues = {}
    // }

    // _setInputValueReducer(input, state, props) {
    //     let value = input.parseJson ? (input.value === '' ? undefined : JSON.parse(input.value)) : input.value
    //     state.inputValues[input.name] = value
    // }

    // _removeInputArrayValueReducer(input, state, props) {
    //     let array = this._getPropertyValue(input, state.inputValues, false)
    //     let index = array.indexOf(input.value)

    //     if (index > -1)
    //         array.splice(index, 1)
    // }

    // _addInputArrayValueReducer(input, state, props) {
    //     let array = this._getPropertyValue(input, state.inputValues, false)
    //     if (array === undefined) {
    //         array = []
    //         state.inputValues[input.name] = array
    //     }

    //     array.push(input.value)
    // }

    // _bindInputTextArrayItemValue(propInput) {
    //     return (currentItem) => {
    //         return event => {
    //             this._queueAction(propInput, {value: event.target.value, currentItem: currentItem})
    //         }
    //     }
    // }

    // _bindInputSelectArrayItemValue(propInput) {
    //     if (propInput.onChangeItemReducer)
    //         propInput.reducers = propInput.reducers.concat(propInput.onChangeItemReducer)

    //     return (currentItem) => {
    //         return (event, index, value) => {
    //             this._queueAction(propInput, {value: value, currentItem: currentItem})
    //         }
    //     }
    // }

    // _bindInputCheckBoxArrayItemValue(propInput) {
    //     return (currentItem) => {
    //         return (event, isInputChecked) => {
    //             this._queueAction(propInput, {value: isInputChecked, currentItem: currentItem})
    //         }
    //     }
    // }

    // _setInputArrayItemValueReducer(input, state, props) {
    //     let value = input.parseJson ? JSON.parse(input.value) : input.value
    //     input.currentItem[input.name] = value
    // }
}
