import { User } from './user'
import * as I from '../types/types'
import * as _ from 'lodash'
import bcrypt = require('bcrypt')

export class Auth extends User {
  /**
   * @description Logs in user and returns user object with jwt token
   * @param email User email
   * @param password Password email
   */
  public async userAuth (email: string, password: string): Promise<I.User> {
    try {
      const user: I.User[] = await this.api('users').where({ email: email }).select()
      if (_.isNil(user)) {
        throw new Error('O usuário não foi encontrado')
      } else {
        const match = bcrypt.compareSync(password, user[0].password)
        if (match) {
          user[0].password = undefined
          user[0].token = await this.generateToken({ id: user[0].id }, '7d')
          return user[0]
        } else {
          throw new Error('A senha está incorreta')
        }
      }
    } catch (error) {
      throw new Error('Erro ao tentar localizar usuário')
    }
  }

  /**
   * @description Checks user availability and initializes user registration
   * @param nome User Name
   * @param email User Email
   * @param password User Password
   */
  public async userRegister (nome: string, email: string, password: string): Promise<I.User> {
    try {
      const result: I.User[] = await this.api('users').where({ email: email }).select()
      if (_.isNil(result[0])) {
        try {
          const user = await this.registerNewUser(nome, email, password)
          return user
        } catch (error) {
          throw new Error(error.message)
        }
      } else {
        throw new Error('Já existe um usuário cadastrado com este email')
      }
    } catch (error) {
      throw new Error(error.message)
    }
  }
}
