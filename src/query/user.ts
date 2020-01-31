import * as I from '@/index'
import { Core } from './core'
import bcrypt = require('bcrypt')

export class User extends Core {
  /**
   * @description Register a new user
   * @param name User Name
   * @param email User Email
   * @param password User Password
   */
  public async registerNewUser (name: string, email: string, password: string): Promise<I.User> {
    const saltRounds = 10
    const hash = bcrypt.hashSync(password, saltRounds)

    try {
      await this.api('users').insert({
        name: name,
        password: hash,
        email: email
      })

      const newUser: I.User[] = await this.api('users').where({ email: email, name: name })
      newUser[0].token = await this.generateToken({ id: newUser[0].id }, '7d')
      newUser[0].password = undefined
      return newUser[0]
    } catch (error) {
      throw new Error('Erro ao tentar registrar usuário')
    }
  }
}
