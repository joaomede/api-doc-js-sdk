import { apiDoc } from './database'

export const tagTest = () => describe('Tag Test', () => {
  test('Create a New Tag', async (done) => {
    try {
      const Tag = {
        nameTag: 'Tag Test',
        descriptionTag: 'Tag about test'
      }
      await apiDoc.createNewTag(Tag, 1, 1)
      done()
    } catch (error) {
      done(error)
    }
  })

  test('Update a Tag', async (done) => {
    try {
      const newTag = {
        nameTag: 'Tag Test',
        descriptionTag: 'Tag about test'
      }
      await apiDoc.updateTag(1, newTag, 1)
      done()
    } catch (error) {
      done(error)
    }
  })

  test('Find all tag by User ID and Api ID', async (done) => {
    try {
      await apiDoc.findAllTagByUserIdAndApiId(1, 1)
      done()
    } catch (error) {
      done(error)
    }
  })
})