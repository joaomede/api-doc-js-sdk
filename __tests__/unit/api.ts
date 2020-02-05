import { apiDoc } from "./database";

export const apiTest = () => describe('Api test', () => {
  test('Create Api Document', async (done) => {
    try {
      const apiForm = {
        id: 1, // not-required
        apiName: 'Api Test',
        version: 'v1.0.0',
        descriptionApi: 'About test',
        email: 'a@a.com',
        license: 'MIT',
        isPublic: true,
        baseURL: 'http://localhost:777',
        created_at: new Date(), // not-required
        updated_at: new Date(), // not-required
        userIdFk: 1, // not-required
      }

      await apiDoc.createNewApiDoc(1, apiForm) // create a public with id 1
      apiForm.isPublic = false // create a private with id 2
      await apiDoc.createNewApiDoc(1, apiForm) // create a two document
      done()
    } catch (error) {
      done(error)
    }
  })

  test('Update a Api Document', async (done) => {
    try {
      const updateForm = {
        id: 1, // not-required
        apiName: 'Api test Updated',
        descriptionApi: 'About test',
        version: 'v1.0.1',
        email: 'a@a.com',
        license: 'MIT',
        isPublic: true,
        baseURL: 'http://localhost:777',
        created_at: new Date(), // not-required
        updated_at: new Date(), // not-required
        userIdFk: 1, // not-required
      }
      await apiDoc.updateApiById(1, 1, updateForm)
      done()
    } catch (error) {
      done(error)
    }
  })

  test('Get All Api Documents', async (done) => {
    try {
      await apiDoc.getAllApiByUser(1)
      done()
    } catch (error) {
      done(error)
    }
  })

  test('Get All Api Document By User and Visibility', async (done) => {
    try {
      await apiDoc.getAllApiByUserAndVisibility(1, true) // Get all public
      await apiDoc.getAllApiByUserAndVisibility(1, false) // Get all private
      done()
    } catch (error) {
      done(error)
    }
  })

  test('Get One Api Document', async (done) => {
    try {
      await apiDoc.getOneApi(1, 1) // get a public
      await apiDoc.getOneApi(1, 2) // get a private
      done()
    } catch (error) {
      done(error)
    }
  })

  test('Get Delete One Api Document', async (done) => {
    try {
      await apiDoc.deleteApiById(1, 2) // delete a private example test
      done()
    } catch (error) {
      done(error)
    }
  })
})