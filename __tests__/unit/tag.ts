import { apiDoc } from './database'

export const tagTest = () => describe('Tag Test', () => {
  test('Create a New Tag', async (done) => {
    try {
      const newEndPoint = {
        nameTag: 'Tag Test',
        descriptionTag: 'Tag about test'
      }
      await apiDoc.createNewTag(newEndPoint, 1, 1)
      done()
    } catch (error) {
      done(error)
    }
  })
})