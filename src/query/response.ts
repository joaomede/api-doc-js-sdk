import { Path } from './path'
import * as I from '../index'
import * as _ from 'lodash'

export class Response extends Path {
  /**
   * @description Create a new Response
   * @param userId User ID
   * @param pathId Path ID
   * @param form Form contains: typeCode, responseModel
   */
  public async createNewResponse (userId: number, pathId: number, form: any): Promise<I.Response> {
    if (_.isNil(userId)) {
      throw new Error('Usuário referência não identificado')
    }

    if (_.isNil(pathId)) {
      throw new Error('Path referência não identificado')
    }

    if (_.isNil(form)) {
      throw new Error('Formulário da resposta não identificado')
    }

    try {
      const newResposne = {
        typeCode: form.typeCode,
        responseModel: form.responseModel,
        userIdFk: userId,
        pathsIdFk: pathId
      }
      await this.api('responses').insert(newResposne)
      const response: I.Response[] = await this.api('responses')
        .where(newResposne)
        .select('*')

      return response[0]
    } catch (error) {
      throw new Error('Erro ao tentar criar o código resposta')
    }
  }

  /**
   * @description Get all responses by Path ID and User ID
   * @param userId User ID
   * @param pathId Path ID
   */
  public async getAllResponsesByPathAndUserId (userId: number, pathId: number): Promise<I.Response[]> {
    if (_.isNil(userId)) {
      throw new Error('Usuário referência não identificado')
    }

    if (_.isNil(pathId)) {
      throw new Error('Path referência não identificado')
    }

    try {
      const responses: I.Response[] = await this.api('responses')
        .where({ userIdFk: userId, pathsIdFk: pathId })
        .select('*')

      return responses
    } catch (error) {
      throw new Error('Erro ao tentar carregar todos os códigos respostas')
    }
  }

  /**
   * @description Update Response
   * @param userId User ID
   * @param responseId Resposne ID
   * @param form Form contains: typeCode and responseModel
   */
  public async updateResponse (userId: number, responseId: number, form: any): Promise<void> {
    if (_.isNil(userId)) {
      throw new Error('Usuário referência não identificado')
    }

    if (_.isNil(responseId)) {
      throw new Error('Resposta referência não identificada')
    }

    if (_.isNil(form)) {
      throw new Error('Formulário da resposta não identificado')
    }

    try {
      const newCode = {
        typeCode: form.typeCode,
        responseModel: form.responseModel
      }
      await this.api('responses').where({ id: responseId, userIdFk: userId }).update(newCode)
    } catch (error) {
      throw new Error('Erro ao tentar atualizar o código resposta')
    }
  }

  /**
   * @description Delete one Response
   * @param userId User ID
   * @param responseId Response ID
   */
  public async deleteResponse (userId: number, responseId: number): Promise<void> {
    if (_.isNil(userId)) {
      throw new Error('Usuário referência não identificado')
    }

    if (_.isNil(responseId)) {
      throw new Error('Resposta referência não identificada')
    }
    try {
      await this.api('responses')
        .where({ id: responseId, userIdFk: userId }).del()
    } catch (error) {
      throw new Error('Erro ao tentar apagar Código resposta')
    }
  }
}
