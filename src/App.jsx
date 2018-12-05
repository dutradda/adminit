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
import {
  Router,
  Route,
  Redirect,
  Switch
} from 'react-router-dom'
import createBrowserHistory from 'history/createBrowserHistory'
import PropTypes from 'prop-types'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import muiThemeable from 'material-ui/styles/muiThemeable'

export default class App extends React.Component {
    static propTypes = {
        theme: PropTypes.object.isRequired,
        routes: PropTypes.arrayOf(
            PropTypes.oneOfType([
                PropTypes.shape({
                    exact: PropTypes.bool,
                    path: PropTypes.string.isRequired,
                    component: PropTypes.func.isRequired
                }),
                PropTypes.shape({
                    exact: PropTypes.bool,
                    from: PropTypes.string.isRequired,
                    to: PropTypes.string.isRequired
                })
            ])
        ).isRequired,
        history: PropTypes.object
    };

    static defaultProps = {
        history: createBrowserHistory()
    };

    render() {
        return (
            <MuiThemeProvider muiTheme={getMuiTheme(this.props.theme)}>
                <Router history={this.props.history}>
                    <Switch>
                        {this._getRoutes()}
                    </Switch>
                </Router>
            </MuiThemeProvider>
        )
    }

    _getRoutes() {
        let routes = []
        let keyCounter = 0

        for (let route of this.props.routes) {
            if (route.component)
                routes.push(
                    <Route
                        exact={route.exact}
                        path={route.path}
                        component={muiThemeable()(route.component)}
                        key={keyCounter}
                    />
                )
            else
                routes.push(
                    <Redirect
                        exact={route.exact}
                        from={route.from}
                        to={route.to}
                        key={keyCounter}
                    />
                )

            keyCounter++
        }

        return routes
    }
}
