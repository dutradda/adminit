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

import {Toolbar, ToolbarGroup, ToolbarTitle} from 'material-ui/Toolbar'
import React from 'react'
import {Link} from 'react-router-dom'
import PropTypes from 'prop-types'

import MuiComponent from './MuiComponent'

export default class BaseHeader extends MuiComponent {
    static propTypes = {
        title: PropTypes.string.isRequired,
        logo: PropTypes.node.isRequired,
        logoAlt: PropTypes.string
    };

    render() {
        let alt = this.props.logoAlt ? this.props.logoAlt : this.props.title

        return (
            <Toolbar style={this.context.muiTheme.swaggeritHeader}>
                 <ToolbarGroup firstChild={true}>
                    <Link to="/" style={{paddingRight: '1em'}}>
                        <img src={this.props.logo} alt={alt} style={{marginLeft: '1em'}}/>
                    </Link>
                    <ToolbarTitle text={this.props.title} style={{color: 'white', fontSize: '1.5em'}}/>
                 </ToolbarGroup>
                 <ToolbarGroup lastChild={true}>
                    {this._getLastChild()}
                 </ToolbarGroup>
            </Toolbar>
        )
    }

    _getLastChild() {
        return null
    }
}
