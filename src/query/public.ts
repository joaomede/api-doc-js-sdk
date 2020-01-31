import { Team } from './team'
import * as I from '../index'

export default class Public extends Team {


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
