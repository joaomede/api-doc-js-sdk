import { apiDoc } from './database'

export const pathTest = () => describe('Path Test', () => {


  // DISABLED = Beacuse UnSupported in sqlite3
  //
  // test('Create a New Path', async (done) => {
  //   try {
  //     const path = {
  //       methodType: 'POST',
  //       pathName: 'Test Method',
  //       descriptionVerb: 'About Test',
  //       path: 'api/v1/test/test',
  //       parameter: { teste: '' },
  //       headersValue: { teste: '' },
  //       bodyValue: { teste: '' },
  //       data: { teste: '' },
  //     }
  //     await apiDoc.createPath(1, 1, path)
  //     done()
  //   } catch (error) {
  //     done(error)
  //   }
  // })
})