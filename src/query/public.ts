import { Team } from './team'
import * as I from '../index'
import * as knex from 'knex'
import populate = require('knex-populate')

export default class Public extends Team {
  public async getApiAndTagsPublic (apiId: number): Promise<I.Api> {
    try {
      const api = await this.api('api').where({ id: apiId })
      const tags: I.Tag[] = await this.api('tags').where({ apiIdFk: apiId })
      api[0].tags = tags

      if (api.length === 0) {
        throw new Error('A api que você está tentando acessar não foi encontrada')
      } else {
        if (api[0].isPublic === 1 || api[0].isPublic === true) {
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
   * @description Get Paths with Response - Public Method
   * @param knexInstance Instance Knex
   * @param tagId Tag ID
   */
  public async getPathAndResponsesPublic (knexInstance: knex<knex>, tagId: number): Promise<I.Path[]> {
    try {
      const verbAndCodes = await populate(knexInstance, 'paths')
        .find({ tagsIdFk: tagId })
        .populate('responses', 'pathsIdFk', 'responses')
        .exec()

      if (verbAndCodes.length === 0) {
        throw new Error('Não há verbos disponíveis')
      } else {
        return verbAndCodes
      }
    } catch (error) {
      throw new Error('Erro ao tentar expandir')
    }
  }

  public async getAllPublicApi (): Promise<I.Api[]> {
    try {
      const allPublicList: I.Api[] = await this.api('api')
        .where({ isPublic: true })
        .join('users', 'users.id', 'api.userIdFk')
        .select('api.id', 'api.descriptionApi', 'api.apiName', 'users.name')
      return allPublicList
    } catch (error) {
      throw new Error('Erro ao tentar listar documentação')
    }
  }
}
