import { Api } from './api'
import * as I from '../index'
import * as _ from 'lodash'
export class Tag extends Api {
  /**
   * @description Create a new Tag
   * @param userId User ID
   * @param apiId Api ID
   * @param form Form with "nameTag" and "descriptionTag"
   */
  public async createNewTag (userId: number, apiId: number, form: any): Promise<I.Tag> {
    try {
      const newEndPoint = {
        nameTag: form.nameTag,
        descriptionTag: form.descriptionTag,
        apiIdFk: apiId,
        userIdFk: userId
      }
      const tag = await this.api('tags').insert(newEndPoint).returning('*')
      return tag[0]
    } catch (error) {
      throw new Error('Erro ao tentar criar Tag')
    }
  }

  /**
   * @description Update a tag
   * @param userId User ID
   * @param tagId Tag ID
   * @param form Form with "nameTag" and "descriptionTag"
   */
  public async updateTagById (userId: number, tagId: number, form: any): Promise<void> {
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
   * @param userId User ID
   * @param apiId Api ID
   */
  public async getAllTagById (userId: number, apiId: number): Promise<I.Tag[]> {
    try {
      const tags: I.Tag[] = await this.api('tags').where({ userIdFk: userId, apiIdFk: apiId })
      return tags
    } catch (error) {
      throw new Error('Erro ao tentar atualizar a tag')
    }
  }

  /**
   * @description Remove a tag by ID and User ID
   * @param userId User ID
   * @param tagId  Tag ID
   */
  public async deleteTagByIdAndUserId (userId: number, tagId: number): Promise<void> {
    try {
      const tag = await this.api('tags').where({ userIdFk: userId, id: tagId })
      if (_.isNil(tag)) {
        throw new Error('Esse tags já foi removido ou não existe')
      } else {
        await this.api('tags').where({ userIdFk: userId, id: tagId }).del()
      }
    } catch (error) {
      throw new Error('Erro ao tentar localizar a tag')
    }
  }
}
