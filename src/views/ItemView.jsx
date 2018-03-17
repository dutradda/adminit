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
import {Card, CardHeader, CardText, CardActions} from 'material-ui/Card'
import ActionDelete from 'material-ui/svg-icons/action/delete'
import EditorModeEdit from 'material-ui/svg-icons/editor/mode-edit'
import Dialog from 'material-ui/Dialog'
import muiThemeable from 'material-ui/styles/muiThemeable'
import BaseView from './BaseView'
import PropertiesViewSimple from './PropertiesViewSimple'
import PropertiesViewArray from './PropertiesViewArray'
import PropertiesViewArrayObjects from './PropertiesViewArrayObjects'
import PropertiesViewArrayInline from './PropertiesViewArrayInline'

export default class ItemView extends BaseView {
    static propTypes = {
        item: PropTypes.oneOfType([
            PropTypes.object.isRequired,
            PropTypes.array.isRequired
        ]),
        simpleProperties: PropTypes.array,
        arrayProperties: PropTypes.array,
        arrayInlineProperties: PropTypes.array,
        itemProperties: PropTypes.array,
        arrayObjectsProperties: PropTypes.array,
        objectProperties: PropTypes.array,
        titleTemplate: PropTypes.object,
        subtitleTemplate: PropTypes.object,
        expandable: PropTypes.bool,
        initExpanded: PropTypes.bool,
        showCardActions: PropTypes.bool,
        size: PropTypes.number,
        name: PropTypes.string,
        type: PropTypes.string,
        children: PropTypes.oneOfType([
            PropTypes.object,
            PropTypes.array
        ]),
        handleEditItem: PropTypes.func,
        handleDeleteItem: PropTypes.func,
        cardStyle: PropTypes.object,
        cardHeaderStyle: PropTypes.object,
        subtitleStyle: PropTypes.object,
        cardTextStyle: PropTypes.object,
        cardActionsStyle: PropTypes.object
    };

    static defaultProps = {
        simpleProperties: [],
        arrayProperties: [],
        arrayInlineProperties: [],
        itemProperties: [],
        arrayObjectsProperties: [],
        objectProperties: [],
        expandable: true,
        cardStyle: {
            backgroundColor: 'white',
            width: '80%',
            marginBottom: '1em'
        },
        cardHeaderStyle: {
            fontWeight: 'bold'
        },
        subtitleStyle: {
            marginTop: '0.5em'
        },
        cardActionsStyle: {
            marginBottom: '-1em',
            marginTop: '1em'
        }
    }

    state = {
        deleteDialog: {open: false},
        errorDialog: {open: false, message: ''}
    };

    render() {
        return (
            <Card
                style={this.props.cardStyle}
                initiallyExpanded={this.props.initExpanded}
            >
                {this._getCardHeader()}
                <CardText expandable={this.props.expandable} style={this.props.cardTextStyle}>
                    {this._getContent()}
                    {this._getCardActions()}
                </CardText>
            </Card>
        )
    }

    _getCardHeader() {
        let title = this.props.titleTemplate
        title = title !== undefined ? this._processTextTemplate(this.props.item, title) : title

        let subtitle = this.props.subtitleTemplate
        subtitle = subtitle !== undefined ? this._processTextTemplate(this.props.item, subtitle) : subtitle

        return <CardHeader
                    style={this.props.cardHeaderStyle}
                    title={title}
                    subtitle={subtitle}
                    actAsExpander={this.props.expandable}
                    showExpandableButton={this.props.expandable}
                    titleStyle={this.rowStyle}
                    subtitleStyle={this.props.subtitleStyle}
                    iconStyle={this.iconStyle}
                />
    }

    _getContent() {
        if (this.props.children)
            return this.props.children
        else
            return (
                <div>
                    <PropertiesViewSimple
                        config={this.props.simpleProperties}
                        item={this.props.item}
                        size={this.props.size}
                    />
                    {this._getItemPropertiesViews()}
                    {this._getArrayInlinePropertiesViews()}
                    {this._getArrayPropertiesViews()}
                    {this._getArrayObjectsPropertiesViews()}
                    {this._getObjectPropertiesViews()}
                </div>
            )
    }

    _getItemPropertiesViews() {
        let views = []
        let counter = 0

        for (let config of this.props.itemProperties)
            views.push(
                <ItemView
                    key={counter++}
                    item={this._getPropertyValue(config, this.props.item, false)}
                    {...config}
                />
            )

        return views
    }

    _getArrayInlinePropertiesViews() {
        let views = []
        let counter = 0

        for (let config of this.props.arrayInlineProperties)
            views.push(
                <PropertiesViewArrayInline
                    key={counter++}
                    items={this._getPropertyValue(config, this.props.item, false)}
                    size={1}
                    {...config}
                />
            )

        return views
    }

    _getArrayPropertiesViews() {
        let views = []
        let counter = 0

        for (let config of this.props.arrayProperties)
            views.push(
                <PropertiesViewArray
                    key={counter++}
                    items={this._getPropertyValue(config, this.props.item, false)}
                    {...config}
                />
            )

        return views
    }

    _getArrayObjectsPropertiesViews() {
        let views = []
        let counter = 0

        for (let config of this.props.arrayObjectsProperties)
            views.push(
                <PropertiesViewArrayObjects
                    key={counter++}
                    items={this._getPropertyValue(config, this.props.item, false)}
                    {...config}
                />
            )

        return views
    }

    _getObjectPropertiesViews() {
        let views = []
        let counter = 0

        for (let objectProp of this.props.objectProperties) {
            let initExpanded = true
            let expandable = false

            if (objectProp.initExpanded === false)
                initExpanded = false

            if (objectProp.expandable === true)
                expandable = true

            views.push(
                <ItemView
                    key={counter++}
                    initExpanded={initExpanded}
                    expandable={expandable}
                    titleTemplate={objectProp.titleTemplate}
                    children={this._buildObjectChild(objectProp, this.props.item)}
                    cardStyle={{
                        backgroundColor: 'white',
                        marginBottom: !expandable ? '1em' : '4em',
                        marginTop: '1em'
                    }}
                    cardHeaderStyle={{
                        fontWeight: 'bold',
                        marginBottom: '-3.5em'
                    }}
                    cardTextStyle={{marginBottom: '-1.5em'}}
                    size={1}
                />
            )
        }

        return views
    }

    _buildObjectChild(objectProp, item) {
        return (
            <p style={{fontSize: this._calculateFontSize(1), whiteSpace: this.rowStyle.whiteSpace}}>
                {this._getPropertyValue(objectProp, item)}
            </p>
        )
    }

    _getCardActions() {
        if (this.props.handleEditItem && this.props.handleDeleteItem && this.props.showCardActions) {
            let deleteDialogActions = [
                <RaisedButton
                    label="No"
                    secondary={true}
                    onTouchTap={this.handleDeleteDialogClose}
                    style={{marginRight: '1em'}}
                />,
                <DeleteRaisedButton
                    label="Yes"
                    onTouchTap={this.handleDeleteItem}
                />
            ]
            let errorDialogActions = (
                <RaisedButton
                    label="Close"
                    secondary={true}
                    onTouchTap={this.handleErrorDialogClose}
                    icon={<EditorModeEdit/>}
                />
            )

            return (
                <CardActions style={this.props.cardActionsStyle}>
                    <RaisedButton
                        label="EDIT"
                        primary={true}
                        icon={<EditorModeEdit/>}
                        onTouchTap={this.handleEditItem}
                    />
                    <DeleteRaisedButton
                        label="DELETE"
                        onTouchTap={this.handleDeleteDialogOpen}
                    />
                    <Dialog
                        modal={false}
                        open={this.state.deleteDialog.open}
                        onRequestClose={this.handleDeleteDialogClose}
                        actions={deleteDialogActions}
                    >
                        Are you sure you want to delete this item?
                    </Dialog>
                    <Dialog
                        modal={false}
                        open={this.state.errorDialog.open}
                        onRequestClose={this.handleErrorDialogClose}
                        actions={errorDialogActions}
                    >
                        {this.state.errorDialog.message}
                    </Dialog>
                </CardActions>
            )

        } else
            return null
    }

    handleDeleteDialogClose = () => {
        this.setState({deleteDialog: {open: false}})
    }

    handleDeleteDialogOpen = () => {
        this.setState({deleteDialog: {open: true}})
    }

    handleErrorDialogClose = () => {
        this.setState({errorDialog: {open: false, message: ''}})
    }

    handleErrorDialogOpen = (message) => {
        this.setState({errorDialog: {open: true, message: message}})
    }

    handleDeleteItem = () => {
        this.props.handleDeleteItem(this.props.item, this.handleDeleteDialogClose, this.handleErrorDialogOpen)
    }

    handleEditItem = () => {
        this.props.handleEditItem(this.props.item)
    }
}

class DeleteRaisedButton extends React.Component {
    render() {
        return <RaisedButton
            labelColor={this.props.muiTheme.palette.alertTextColor}
            backgroundColor={this.props.muiTheme.palette.alertColor}
            label={this.props.label}
            icon={<ActionDelete/>}
            onTouchTap={this.props.onTouchTap}
        />
    }
}

DeleteRaisedButton = muiThemeable()(DeleteRaisedButton)
