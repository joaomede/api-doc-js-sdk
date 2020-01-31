import { Tag } from './tag'
import * as _ from 'lodash'
import * as I from '../index'

export class Path extends Tag {
  /**
   * @description Create a New Path
   * @param userId User ID
   * @param tagId Tag ID
   * @param form Form contain fields: methodType, pathName, descriptionVerb, path, parameter,
   * headersValue, bodyValue and data
   */
  public async createPath (userId: number, tagId: number, form: any): Promise<I.Path> {
    if (_.isNil(tagId)) {
      throw new Error('Não foi identificado o path referência')
    }

    if (_.isNil(userId)) {
      throw new Error('Não foi identificado a referência do usuário')
    }

    if (_.isNil(form)) {
      throw new Error('Formulário não identificado')
    }
    try {
      const newPath = {
        methodType: form.methodType,
        pathName: form.pathName,
        descriptionVerb: form.descriptionVerb,
        path: form.path,
        parameter: form.parameter,
        headersValue: form.headersValue,
        bodyValue: form.bodyValue,
        data: form.data,
        tagsIdFk: tagId,
        userIdFk: userId
      }
      await this.api('paths').insert(newPath)
      const path: I.Path[] = await this.api('paths').where(newPath).select()
      return path[0]
    } catch (error) {
      throw new Error('Erro ao tentar crar novo Path')
    }
  }

  /**
   * @description Get all paths by ID and User ID
   * @param userId User ID
   * @param tagId Tag ID
   */
  public async getAllPathByIdAndUserId (userId: number, tagId: number): Promise<I.Path[]> {
    if (_.isNil(tagId)) {
      throw new Error('Não foi identificado o path relacionado')
    }
    try {
      const path: I.Path[] = await this.api('paths').where({ userIdFk: userId, tagsIdFk: tagId })
      return path
    } catch (error) {
      throw new Error('Erro ao tentar carregar todos os Paths')
    }
  }

  /**
   * @description Update a Path
   * @param userId User ID
   * @param pathId Path ID
   * @param form Form contains: methodType, pathName, descriptionVerb, path, parameter,
   * headersValue, bodyValue and data
   */
  public async updatePath (userId: number, pathId: number, form: any): Promise<void> {
    const newVerb = {
      methodType: form.methodType,
      pathName: form.pathName,
      descriptionVerb: form.descriptionVerb,
      path: form.path,
      parameter: form.parameter,
      headersValue: form.headersValue,
      bodyValue: form.bodyValue,
      data: form.data
    }

    try {
      await this.api('paths').where({ id: pathId, userIdFk: userId }).update(newVerb)
    } catch (error) {
      throw new Error('Erro ao tentar atualizar o paths')
    }
  }
}
