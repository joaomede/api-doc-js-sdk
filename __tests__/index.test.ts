import { databaseTest } from './unit/database'
import { authTest } from './unit/auth'
import { apiTest } from './unit/api'

describe('Init', () => {
  databaseTest()
  authTest()
  apiTest()
})