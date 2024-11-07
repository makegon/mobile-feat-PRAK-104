/**
 * @format
 */

import 'react-native'
import React from 'react'
import App from '../src/App.tsx'

// Note: import explicitly to use the types shipped with jest.
import {it} from '@jest/globals'

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer'

//TODO переделать тест по необходимости
it('renders correctly', () => {
  renderer.create(<App />)
})
