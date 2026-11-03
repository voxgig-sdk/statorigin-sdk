
import { test, describe } from 'node:test'
import { equal } from 'node:assert'


import { StatoriginSDK } from '..'


describe('exists', async () => {

  test('test-mode', () => {
    const testsdk = StatoriginSDK.test()
    equal(testsdk instanceof StatoriginSDK, true,
      'StatoriginSDK.test() must return a client synchronously')
  })

})
