import { apiDoc } from './database'

export const authTest = () => describe('Auth Test', () => {
  test('Register new user', async (done) => {
    try {
      await apiDoc.userRegister('teste', 'a@a.com', '123456')
      done()
    } catch (error) {
      done(error)
    }
  })

  test('Auth User', async (done) => {
    try {
      const user = await apiDoc.userAuth('a@a.com', '123456')
      done()
    } catch (error) {
      done(error)
    }
  })
})