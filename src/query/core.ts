import * as knex from 'knex'
import * as jwt from 'jsonwebtoken'
import * as path from 'path'
import populate from 'knex-populate'
import Knex = require('knex')

export class Core {
  public config: knex.Config
  private secret: string
  public populate = populate

  constructor (config: knex.Config, secret: string) {
    this.config = config
    this.config.migrations = {
      directory: path.join(__dirname, '../migrations')
    }
    this.secret = secret
  }

  public async migrate (): Promise<void> {
    try {
      await this.knex().migrate.latest({ loadExtensions: ['.js'] })
    } catch (error) {
      throw new Error(error)
    }
  }

  public knex (): knex<knex> {
    return Knex(this.config)
  }

  /**
   * @description Gera um novo token com validade determinada pelo parametro validade
   * @param id ID do usuário para gerar token
   * @param validade Validade do token, ex: 7d
   */
  public async generateToken (params: string | object, validade: string): Promise<string> {
    return jwt.sign(params, this.secret, {
      expiresIn: validade
    })
  }

  /**
   * @description Método central que inicia query
   * @param table Nome da tabela
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public api (table: string): knex.QueryBuilder<any> {
    return this.knex().table(table)
  }
}
