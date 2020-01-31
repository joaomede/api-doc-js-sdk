import { Team } from './team'
import * as I from '../index'

export default class Public extends Team {

  public async getPathAndResponsesPublic (tagId: number): Promise<void> {
    try {
      const verbAndCodes = await this.populate(this.knex, 'paths')
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

  public async listAllPublicApi (): Promise<void> {
    try {
      const allPublicList = await this.api('api')
        .where({ isPublic: true })
        .join('users', 'users.id', 'api.userIdFk')
        .select('api.id', 'api.descriptionApi', 'api.apiName', 'users.name')
      return allPublicList
    } catch (error) {
      throw new Error('Erro ao tentar listar documentação')
    }
  }
}
