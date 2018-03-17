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
import Snackbar from 'material-ui/Snackbar'
import muiThemeable from 'material-ui/styles/muiThemeable'
import PatchContainer from './PatchContainer'

export default class SnackbarContainer extends PatchContainer {
    _bindMethods() {
        super._bindMethods()
        this.closeSnackbar = this.closeSnackbar.bind(this)
        this.openSnackbar = this.openSnackbar.bind(this)
    }

    _setActions() {
        super._setActions()
        this.actions.setSnackbar = {
            stateKey: 'snackbar',
            reducers: [this._setStateValueReducer]
        }
    }

    _setInitialState() {
        super._setInitialState()
        this.state.snackbar = {
            open: false,
            message: ''
        }
    }

    closeSnackbar() {
        let snackbarState = {open: false, message: ''}
        this._queueAction(this.actions.setSnackbar, {value: snackbarState})
    }

    openSnackbar(message) {
        let snackbarState = {open: true, message}

        if (this.state.snackbar.open === true)
            this.closeSnackbar()

        this._queueAction(this.actions.setSnackbar, {value: snackbarState})
    }

    _getSnackBar(colorName) {
        return <ColoredSnackbar
            open={this.state.snackbar.open}
            message={this.state.snackbar.message}
            onRequestClose={this.closeSnackbar}
            colorName={colorName}
        />
    }
}

class ColoredSnackbar extends React.Component {
    render() {
        let color = this.props.muiTheme.palette[this.props.colorName]
        return <Snackbar
            open={this.props.open}
            message={this.props.message}
            onRequestClose={this.props.onRequestClose}
            autoHideDuration={8000}
            bodyStyle={{backgroundColor: color}}
            contentStyle={{textAlign: 'center'}}
        />
    }
}

ColoredSnackbar = muiThemeable()(ColoredSnackbar)
