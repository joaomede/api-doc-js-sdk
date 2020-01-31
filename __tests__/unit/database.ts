
import Api from '../../lib/index'
import * as path from 'path'

const connection = {
  client: 'sqlite3',
  connection: {
    filename: path.join(__dirname, '../../mydb.sqlite')
  },
  pool: { min: 0, max: 10, idleTimeoutMillis: 500 },
  useNullAsDefault: true
}

export const apiDoc = new Api(connection, 'teste')


export const databaseTest = () => describe('Database test', () => {
  test('Migration', async (done) => {
    try {
      await apiDoc.migrate()
      console.log('Migration sucess')
      done()
    } catch (error) {
      done(error)
    }
  })
})