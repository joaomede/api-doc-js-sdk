import { Auth } from './auth'
import * as I from '../index'

export class Api extends Auth {
  /**
   * @description Create a new API Documentation
   * @param apiForm Form for new API
   * @param userId User ID
   */
  public async createNewApiDoc (apiForm: I.Api, userId: number): Promise<void> {
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
   * @param id Api ID
   * @param newApi Api update form
   * @param userId User ID
   */
  public async updateApi (id: number, newApi: I.Api, userId: number): Promise<void> {
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
  public async getAllApiByUser (userId: number): Promise<string[] | number[]> {
    try {
      const allApi = await this.api('api').select().where({ userIdFk: userId })
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
  public async getAllApiByUserAndVisibility (userId: number, isPublic: boolean): Promise<string[] | number[]> {
    try {
      const allApi = await this.api('api').select().where({ userIdFk: userId, isPublic: isPublic })
      return allApi
    } catch (error) {
      throw new Error('Erro ao tentar listar as documentações')
    }
  }

  /**
   * @description Get one API doc
   * @param id API ID
   * @param userId User ID
   */
  public async getOneApi (id: number, userId: number): Promise<I.Api> {
    try {
      const api = await this.api('api').select().where({ id: id, userIdFk: userId })
      return api[0]
    } catch (error) {
      throw new Error('Erro ao tentar carregar as informações da api')
    }
  }

  /**
   * @description Delete one API
   * @param id Api ID
   * @param userId User ID
   */
  public async deleteApi (id: number, userId: number): Promise<void> {
    try {
      await this.api('api').where({ id: id, userIdFk: userId }).del()
    } catch (error) {
      throw new Error('Erro ao tentar deletar documentação')
    }
  }

  /**
   * @description Get a Path and all Responses related
   * @param tagId Tag ID
   */
  public async getPathAndResponses (tagId: string): Promise<I.Path[]> {
    try {
      const list = await this.populate(this.knex, 'paths')
        .find({ tagsIdFk: tagId })
        .populate('responses', 'pathsIdFk', 'responses')
        .exec()
      return list
    } catch (error) {
      throw new Error('Erro ao tentar expandir')
    }
  }

  /**
   * @description Get a Api and all Tags related
   * @param apiId API ID
   * @param userId User ID
   */
  public async getApiAndTags (apiId: number, userId: number): Promise<I.Api> {
    try {
      const api = await this.api('api').where({ id: apiId })
      const tags = await this.api('tags').where({ apiIdFk: apiId })
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
}
