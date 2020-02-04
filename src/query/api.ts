import { Auth } from './auth'
import * as I from '../index'
import * as knex from 'knex'
import populate = require('knex-populate')

export class Api extends Auth {
  /**
   * @description Create a new API Documentation
   * @param userId User ID
   * @param apiForm Form for new API
   */
  public async createNewApiDoc (userId: number, apiForm: I.Api): Promise<void> {
    try {
      await this.api('api').insert({
        apiName: apiForm.apiName,
        version: apiForm.version,
        descriptionApi: apiForm.descriptionApi,
        email: apiForm.email,
        license: apiForm.license,
        isPublic: apiForm.isPublic,
        baseURL: apiForm.baseURL,
        userIdFk: userId
      })
    } catch (error) {
      throw new Error('Erro ao tentar criar uma nova documentação')
    }
  }

  /**
   * @description Updates an existing api
   * @param userId User ID
   * @param id Api ID
   * @param newApi Api update form
   */
  public async updateApi (userId: number, id: number, newApi: I.Api): Promise<void> {
    try {
      const api = {
        apiName: newApi.apiName,
        version: newApi.version,
        email: newApi.email,
        license: newApi.license,
        isPublic: newApi.isPublic,
        baseURL: newApi.baseURL,
        descriptionApi: newApi.descriptionApi
      }

      await this.api('api').where({ id: id, userIdFk: userId }).update(api)
    } catch (error) {
      throw new Error('Erro ao tentar atualizar a Api')
    }
  }

  /**
   * @description Get All Api docs by User
   * @param userId User ID
   */
  public async getAllApiByUser (userId: number): Promise<I.Api[]> {
    try {
      const allApi: I.Api[] = await this.api('api')
        .where({ userIdFk: userId })
        .select('*')

      return allApi
    } catch (error) {
      throw new Error('Erro ao tentar listar as documentações')
    }
  }

  /**
   * @description Get All Api docs by user and visibility, is public or not
   * @param userId User ID
   * @param isPublic State of visibility: true | false
   */
  public async getAllApiByUserAndVisibility (userId: number, isPublic: boolean): Promise<I.Api[]> {
    try {
      const allApi: I.Api[] = await this.api('api')
        .where({ userIdFk: userId, isPublic: isPublic })
        .select('*')

      return allApi
    } catch (error) {
      throw new Error('Erro ao tentar listar as documentações')
    }
  }

  /**
   * @description Get one API doc
   * @param userId User ID
   * @param id API ID
   */
  public async getOneApi (userId: number, id: number): Promise<I.Api> {
    try {
      const api = await this.api('api')
        .where({ id: id, userIdFk: userId })
        .select('*')

      return api[0]
    } catch (error) {
      throw new Error('Erro ao tentar carregar as informações da api')
    }
  }

  /**
   * @description Delete one API
   * @param userId User ID
   * @param id Api ID
   */
  public async deleteApi (userId: number, id: number): Promise<void> {
    try {
      await this.api('api').where({ id: id, userIdFk: userId }).del()
    } catch (error) {
      throw new Error('Erro ao tentar deletar documentação')
    }
  }

  /**
   * @description Get a Api and all Tags related
   * @param userId User ID
   * @param apiId API ID
   */
  public async getApiAndTags (userId: number, apiId: number): Promise<I.Api> {
    try {
      const api: I.Api[] = await this.api('api').where({ id: apiId })
      const tags: I.Tag[] = await this.api('tags').where({ apiIdFk: apiId })
      if (api.length === 0) {
        throw new Error('A api que você está tentando acessar não foi encontrada')
      } else {
        api[0].tags = tags
        if (api[0].userIdFk === userId) {
          return api[0]
        } else {
          throw new Error('Você não tem autorização para acessar essa documentação')
        }
      }
    } catch (error) {
      throw new Error('Erro ao tentar carregar a documentação')
    }
  }

  /**
   * @description Get a Path and all Responses related
   * @param knexInstance Instance Knex
   * @param tagId Tag ID
   */
  public async getPathAndResponses (knexInstance: knex<knex>, tagId: string): Promise<I.Path[]> {
    try {
      const list: I.Path[] = await populate(knexInstance, 'paths')
        .find({ tagsIdFk: tagId })
        .populate('responses', 'pathsIdFk', 'responses')
        .exec()
      return list
    } catch (error) {
      throw new Error(error)
    }
  }
}
