import { Api } from './api'
import * as I from '../index'
export class Tag extends Api {
  /**
   * @description Create a new Tag
   * @param form Form with "nameTag" and "descriptionTag"
   * @param apiId Api ID
   * @param userId User ID
   */
  public async createNewTag (form: any, apiId: number, userId: number): Promise<I.Tag> {
    try {
      const newEndPoint = {
        nameTag: form.nameTag,
        descriptionTag: form.descriptionTag,
        apiIdFk: apiId,
        userIdFk: userId
      }
      await this.api('tags').insert(newEndPoint)
      const tag = await this.api('tags').where(newEndPoint)
      return tag[0]
    } catch (error) {
      throw new Error('Erro ao tentar criar Tag')
    }
  }

  /**
   * @description Update a tag
   * @param tagId Tag ID
   * @param form Form with "nameTag" and "descriptionTag"
   * @param userId User ID
   */
  public async updateTag (tagId: number, form: any, userId: number): Promise<void> {
    try {
      const newEndpoint = {
        nameTag: form.nameTag,
        descriptionTag: form.descriptionTag
      }
      await this.api('tags').where({ id: tagId, userIdFk: userId }).update(newEndpoint)
    } catch (error) {
      throw new Error('Erro ao tentar atualizar a tag')
    }
  }

  /**
   * @description Find all Tags by User ID and Api ID
   * @param apiId Api ID
   * @param userId User ID
   */
  public async findAllTagByUserIdAndApiId (apiId: number, userId: number): Promise<I.Tag[]> {
    try {
      const tags: I.Tag[] = await this.api('tags').where({ userIdFk: userId, apiIdFk: apiId })
      return tags
    } catch (error) {
      throw new Error('Erro ao tentar atualizar a tag')
    }
  }
}
