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
import createMemoryHistory from 'history/createMemoryHistory'
import renderer from 'react-test-renderer'
import {App} from '..'

let ComponentToRoute1 = () => {
    return <p>Test1</p>
}

class ComponentToRoute2 extends React.Component {
    render() {
        return <p>Test2</p>
    }
}

function createValidComponent(history) {
    return renderer.create(
        <App
            theme={{}}
            routes={[{
                exact: true,
                path: '/1',
                component: ComponentToRoute1
            },{
                from: '/1r',
                to: '/1'
            },{
                exact: true,
                from: '/1er',
                to: '/1'
            },{
                path: '/2',
                component: ComponentToRoute2
            },{
                from: '/2r',
                to: '/2'
            },{
                exact: true,
                from: '/2er',
                to: '/2'
            }]}
            history={history}
        />
    )
}

test("renders App routes", () => {
    let history = createMemoryHistory()
    let component = createValidComponent(history)

    history.push('/1')
    expect(component.toJSON()).toMatchSnapshot()

    history.push('/2')
    expect(component.toJSON()).toMatchSnapshot()
})

test("renders App with invalid path", () => {
    let history = createMemoryHistory()
    let component = createValidComponent(history)

    history.push('invalid')
    expect(component.toJSON()).toMatchSnapshot()
})

test("renders App with exact route", () => {
    let history = createMemoryHistory()
    let component = createValidComponent(history)

    history.push('/1/2')
    expect(component.toJSON()).toMatchSnapshot()
})

test("renders App without exact route", () => {
    let history = createMemoryHistory()
    let component = createValidComponent(history)

    history.push('/2/3')
    expect(component.toJSON()).toMatchSnapshot()
})

test("renders App redict", () => {
    let history = createMemoryHistory()
    let component = createValidComponent(history)

    history.push('/1r')
    expect(component.toJSON()).toMatchSnapshot()

    history.push('/1er')
    expect(component.toJSON()).toMatchSnapshot()

    history.push('/2r')
    expect(component.toJSON()).toMatchSnapshot()

    history.push('/2er')
    expect(component.toJSON()).toMatchSnapshot()
})

test("renders App redirecting 'from' with exact and 'to' with exact", () => {
    let history = createMemoryHistory()
    let component = createValidComponent(history)

    history.push('/1er/2')
    expect(component.toJSON()).toMatchSnapshot()
})

test("renders App redirecting 'from' without exact and 'to' with exact", () => {
    let history = createMemoryHistory()
    let component = createValidComponent(history)

    history.push('/1r/2')
    expect(component.toJSON()).toMatchSnapshot()
})

test("renders App redirecting 'from' with exact and 'to' without exact", () => {
    let history = createMemoryHistory()
    let component = createValidComponent(history)

    history.push('/2er/2')
    expect(component.toJSON()).toMatchSnapshot()
})

test("renders App redirecting 'from' without exact and 'to' without exact", () => {
    let history = createMemoryHistory()
    let component = createValidComponent(history)

    history.push('/2r/2')
    expect(component.toJSON()).toMatchSnapshot()
})
