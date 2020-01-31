import { databaseTest } from './unit/database'
import { authTest } from './unit/auth'
import { apiTest } from './unit/api'
import { tagTest } from "./unit/tag";

describe('Init', () => {
  databaseTest()
  authTest()
  apiTest()
  tagTest()
})