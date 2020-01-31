import { Response } from './response'
import * as I from '../index'
import * as _ from 'lodash'
export class Team extends Response {

  /**
   * @description List all team members
   * @param userId User ID
   * @param teamIdFk Team ID
   */
  public async listAllMembers (userId: number, teamIdFk: number): Promise<any> {
    try {
      const team: I.Team[] = await this.api('teams')
        .where({ id: teamIdFk, managerIdFk: userId }).select()

      if (_.isNil(team)) {
        throw new Error('Esse time não existe')
      } else {
        const listAllMembers = await this.api('team_rules').where({
          teamIdFk: teamIdFk
        }).join('users', 'users.id', 'team_rules.userIdFk').select('users.name', 'team_rules.id')
        return listAllMembers
      }
    } catch (error) {
      throw new Error(error.message)
    }
  }
}
