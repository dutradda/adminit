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

import BaseContainer from './BaseContainer'

export default class HttpContainer extends BaseContainer {
    _buildHttpResultHandlerBuilder(callback) {
        return (response) => {
            response.json().then(
                (body) => {
                    callback(body)
                }
            )
        }
    }

    _buildHttpErrorMessageHandler(callback) {
        return response => {
            response.json().then(
                (body) => {
                    let message = body

                    if (body.message !== undefined)
                        message = body.message

                    else if (body['database message'] !== undefined)
                        message = body['database message'].message

                    if (callback)
                        callback(message)
                }
            )
        }
    }

    routePage(url) {
        this.props.history.push(url)
    }

    backPage() {
        this.props.history.goBack()
    }

    reloadPage() {
        this.props.history.go(0)
    }
}
