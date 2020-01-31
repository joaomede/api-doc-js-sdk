import { Api } from './api'
import * as I from '../index'
export class Tag extends Api {
  public async createNewTag (form: any, apiId: number, userId: number): Promise<I.Tag> {
    try {
      const newEndPoint = {
        nameTag: form.nameTag,
        descriptionTag: form.descriptionTag,
        apiIdFk: apiId,
        userIdFk: userId
      }
      await this.api('tags').insert(newEndPoint).returning('*')
      const tag = await this.api('tags').where(newEndPoint)
      return tag
    } catch (error) {
      throw new Error('Erro ao tentar criar Tag')
    }
  }
}
