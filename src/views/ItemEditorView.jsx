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
import ItemEditor from '../editors/ItemEditor'

export default class ItemEditorView extends BaseView {
    static propTypes = {
        collectionName: PropTypes.string.isRequired,
        itemName: PropTypes.string.isRequired,
        item: PropTypes.object,
        inputs: PropTypes.array.isRequired,
        showTopCancelButton: PropTypes.bool,
        handleApply: PropTypes.func.isRequired,
        handleCancel: PropTypes.func.isRequired,
        titleStyle: PropTypes.object.isRequired,
        contentStyle: PropTypes.object.isRequired,
        isNewItem: PropTypes.bool.isRequired
    };

    static defaultProps = {
        item: {},
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

    componentWillMount() {
        this.editorAction = this.props.isNewItem ? 'NEW' : 'EDIT'
    }

    render() {
        return (
            <div>
                <Paper zDepth={0} style={this.props.contentStyle}>
                    {this._getEditorTitle()}
                    {this.props.showTopCancelButton ? this._getCancelButton() : null}
                    <br />
                    {this._getItemEditor()}
                    {this._getEditorButtons()}
                </Paper>
            </div>
        )
    }

    _getEditorTitle() {
        let itemTitle = this._toUpperCase(this.props.itemName)
        itemTitle = `${this.editorAction} ${itemTitle}`
        return (
            <h1 style={this.props.titleStyle}>
                {itemTitle}
            </h1>
        )
    }

     _getItemEditor() {
        return (
            <ItemEditor
                item={this.props.item}
                inputs={this.props.inputs}
                isNewItem={this.props.isNewItem}
            />
        )
    }

    _getEditorButtons() {
        return (
            <div>
                <br/>
                {this._getCancelButton()}
                <RaisedButton
                    label="APPLY"
                    primary={true}
                    onTouchTap={this.props.handleApply}
                />
            </div>
        )
    }

    _getCancelButton() {
        return (
            <RaisedButton
                label="BACK"
                secondary={true}
                style={{marginRight: '1em'}}
                onTouchTap={this.props.handleCancel}
            />
        )
    }
}
