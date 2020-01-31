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
      const response: I.Response[] = await this.api('responses').where(newResposne).select()
      return response[0]
    } catch (error) {
      throw new Error('Erro ao tentar criar o código resposta')
    }
  }

}
