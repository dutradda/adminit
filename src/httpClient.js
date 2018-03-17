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

import store from 'store'
import {raiseNotImplementedError} from './utils'

export default class HttpClient {
    constructor(apiUriPrefix, invalidAuthCb, enableAuth = true) {
        this._apiUriPrefix = apiUriPrefix
        this._invalidAuthCb = invalidAuthCb
        this._enableAuth = enableAuth
        this.setUser()
    }

    setUser(user) {
        if (this._enableAuth === true) {
            if (user === undefined) {
                user = store.get('httpUser')

                if (user === undefined)
                  user = this._buildNewUser()
            }

            this.user = user
            this._persistUser()
        }
    }

    _buildNewUser() {
        return {}
    }

    _persistUser() {
        store.set('httpUser', this.user)
    }

    validateUser(successCb) {
        let _successCb = (response) => {
            response.json().then(
                (user) => {
                    this.setUser(user)

                    if (this._validateUser(user) === true)
                        if (successCb !== undefined)
                            successCb(this.user)
                }
            )
        }

        this.get(this._getUserURL(), _successCb)
    }

    _validateUser(response) {
        raiseNotImplementedError(this, this._validateUser)
    }

    _getUserURL() {
        raiseNotImplementedError(this, this._getUserURL)
    }

    delUser() {
        this.user = undefined
        store.remove('httpUser')
    }

    get(sufix, success, failure, data) {
        let url = this._processUrl(sufix)
        return this._processRequest(url, 'GET', data, {}, success, failure)
    }

    _processUrl(sufix) {
        return `${this._apiUriPrefix}/${sufix}`
    }

    _processRequest(url, method, body, headers, success, failure) {
        let req = {method, body, headers}

        if (this._enableAuth === true)
            req.headers.Authorization = this._buildAuthorizationHeader()

        try {
            return fetch(url, req).then(
                (response) => {
                    let statusCode = response.status.toString()

                    if (statusCode.startsWith('2'))
                        this.handleResponse(response, success)
                    else if (statusCode.startsWith('3'))
                        this.handleRedirect(response, success)
                    else
                        this.handleResponse(response, failure)
                },
                (response) => this.handleResponse(response, failure)
            )
        }

        catch(response) {
            this.handleResponse(response, failure)
        }
    }

    _buildAuthorizationHeader() {
        raiseNotImplementedError(this, this._buildAuthorizationHeader)
    }

    post(sufix, success, failure, data) {
        let url = this._processUrl(sufix)
        let headers = this._buildHeadersWithContentType()
        return this._processRequest(url, 'POST', data, headers, success, failure)
    }

    _buildHeadersWithContentType() {
        return {'Content-Type': 'application/json'}
    }

    patch(sufix, success, failure, data) {
        let url = this._processUrl(sufix)
        let headers = this._buildHeadersWithContentType()
        return this._processRequest(url, 'PATCH', data, headers, success, failure)
    }

    delete(sufix, success, failure, data) {
        let url = this._processUrl(sufix)
        return this._processRequest(url, 'DELETE', data, {}, success, failure)
    }

    handleResponse(response, callback) {
        if (this._enableAuth === true && (response.status === 401 || response.status === 403)) {
            this.delUser()
            this._invalidAuthCb(response)

        } else if (callback)
            callback(response)
    }
}
