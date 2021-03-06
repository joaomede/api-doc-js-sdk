import { Response } from './response'
import * as I from '../index'
import * as _ from 'lodash'
import * as knex from 'knex'
import populate = require('knex-populate')

export class Team extends Response {
  /**
   * @description Create a new Team
   * @param userId User ID
   * @param form Form contains: "teamName" and "apiIdFk"
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async createTeam (userId: number, form: any): Promise<string> {
    try {
      const api: I.Api[] = await this.api('api')
        .where({ id: form.apiIdFk, isPublic: false, userIdFk: userId })
        .select('*')

      const team: I.Team[] = await this.api('teams')
        .where({ apiIdFk: form.apiIdFk })
        .select('*')

      if (team.length === 0) {
        if (api.length !== 0) {
          await this.api('teams').insert({
            teamName: form.teamName,
            apiIdFk: form.apiIdFk,
            managerIdFk: userId
          })
          return `O time ${form.teamName} foi criado com sucesso`
        } else {
          throw new Error('Api relacionada não existe')
        }
      } else {
        throw new Error('Já existe um time associado a essa Api')
      }
    } catch (error) {
      throw new Error(error.message)
    }
  }

  /**
   * @description Update a team
   * @param userId User ID
   * @param teamId Team ID
   * @param form Form contains: "teamName"
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async updateTeam (userId: number, teamId: number, form: any): Promise<I.Team> {
    try {
      const team = await this.api('teams')
        .where({ id: teamId })
        .select('*')

      if (team.length !== 0) {
        if (team[0].managerIdFk === userId) {
          await this.api('teams').where({ id: teamId }).update({
            teamName: form.teamName
          })
          const teams: I.Team[] = await this.api('teams').where({ id: teamId, teamName: form.teamName })
          return teams[0]
        } else {
          throw new Error('Você não tem autorização para atualizar o time')
        }
      } else {
        throw new Error('O time informado não foi encontrado')
      }
    } catch (error) {
      throw new Error(error.message)
    }
  }

  /**
   * @description Get all team by User ID
   * @param userId User ID
   */
  public async getAllTeamByUserId (userId: number): Promise<I.Team[]> {
    try {
      const teams: I.Team[] = await this.api('teams')
        .where({ managerIdFk: userId })
        .select('*')

      return teams
    } catch (error) {
      throw new Error('Erro ao tentar localizar todas as equipes')
    }
  }

  /**
   * @description Delete a team
   * @param userId User ID "owner"
   * @param teamId Team ID
   */
  public async deleteTeamById (userId: number, teamId: number): Promise<void> {
    try {
      await this.api('teams').where({ id: teamId, managerIdFk: userId }).del()
    } catch (error) {
      throw new Error('Erro ao tenta remover equipe')
    }
  }

  /**
   * @description Add a member to the team
   * @param userId User ID
   * @param form Form contains: "teamIdFk" and "email"
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async addNewMember (userId: number, form: any): Promise<void> {
    try {
      const team: I.Team[] = await this.api('teams')
        .where({
          id: form.teamIdFk,
          managerIdFk: userId
        })
        .select('*')

      const user: I.User[] = await this.api('users')
        .where({ email: form.email })
        .select('*')

      const rules: I.TeamRules[] = await this.api('team_rules')
        .where({
          teamIdFk: form.teamIdFk,
          userIdFk: user[0].id
        })
        .select('*')

      if (_.isNil(team)) {
        throw new Error('O time informado não existe')
      }

      if (_.isNil(user)) {
        throw new Error('O email informado não pertence a nenhum usuário')
      }

      if (user[0].id === userId) {
        throw new Error('Não é permitido adicionar você mesmo')
      }

      if (rules.length === 1) {
        throw new Error('Esse usuário já está no time')
      }

      await this.api('team_rules').insert({
        teamIdFk: form.teamIdFk,
        userIdFk: user[0].id
      })
    } catch (error) {
      throw new Error(error)
    }
  }

  /**
   * @description Remove a member from team
   * @param rulesId Rules ID
   */
  public async deleteMemberById (rulesId: number): Promise<void> {
    try {
      await this.api('team_rules').where({ id: rulesId }).del()
    } catch (error) {
      throw new Error('Erro ao tentar remover regras da equipe')
    }
  }

  /**
   * @description List all team members
   * @param userId User ID
   * @param teamIdFk Team ID
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async getAllMembersByTeamId (userId: number, teamIdFk: number): Promise<any[]> {
    try {
      const team: I.Team[] = await this.api('teams')
        .where({ id: teamIdFk, managerIdFk: userId })
        .select('*')

      if (_.isNil(team)) {
        throw new Error('Esse time não existe')
      } else {
        const listAllMembers: any[] = await this.api('team_rules').where({
          teamIdFk: teamIdFk
        }).join('users', 'users.id', 'team_rules.userIdFk').select('users.name', 'team_rules.id')
        return listAllMembers
      }
    } catch (error) {
      throw new Error(error.message)
    }
  }

  /**
   * @description Get Api with Tags - Team Method
   * @param userId User ID
   * @param ruleId Rule ID
   */
  public async getApiAndTagsTeam (userId: number, ruleId: number): Promise<I.Api> {
    const rules = await this.api('team_rules')
      .where({ 'team_rules.id': ruleId, userIdFk: userId })
      .join('teams', 'teams.id', 'team_rules.teamIdFk')
      .select('teams.apiIdFk')

    try {
      if (rules.length !== 0) {
        const api: I.Api[] = await this.api('api').where({ id: rules[0].apiIdFk })
        const tags: I.Tag[] = await this.api('tags').where({ apiIdFk: rules[0].apiIdFk })
        api[0].tags = tags

        if (api.length === 0) {
          throw new Error('A api que você está tentando acessar não foi encontrada')
        } else {
          return api[0]
        }
      } else {
        throw new Error('A equipe informada foi encontrada ou você não faz parte')
      }
    } catch (error) {
      throw new Error('Erro ao tentar carregar a documentação')
    }
  }

  /**
   * @description Get Paths with Response - Team Method
   * @param knexInstance Instance Knex
   * @param userId User ID
   * @param tagId Tag ID
   * @param ruleId Rule ID
   */
  public async getPathAndResponsesTeam (knexInstance: knex<knex>, userId: number, tagId: number, ruleId: number): Promise<I.Path[]> {
    const rules = await this.api('team_rules')
      .where({ 'team_rules.id': ruleId, userIdFk: userId })
      .join('teams', 'teams.id', 'team_rules.teamIdFk')
      .select('teams.apiIdFk')

    try {
      if (rules.length !== 0) {
        const verbAndCodes: I.Path[] = await populate(knexInstance, 'paths')
          .find({ tagsIdFk: tagId })
          .populate('responses', 'pathsIdFk', 'responses')
          .exec()

        if (verbAndCodes.length === 0) {
          throw new Error('Não há verbos disponíveis')
        } else {
          return verbAndCodes
        }
      } else {
        throw new Error('A equipe informada foi encontrada ou você não faz parte')
      }
    } catch (error) {
      throw new Error('Erro ao tentar expandir')
    }
  }

  /**
   * @description Team list that the applicant owns
   * @param userId User ID "Owner"
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async listTeamsOwner (userId: number): Promise<any[]> {
    try {
      const teamsAmMember: any[] = await this.api('team_rules')
        .where({ 'team_rules.userIdFk': userId })
        .join('teams', 'teams.id', 'team_rules.teamIdFk')
        .join('api', 'api.id', 'teams.apiIdFk')
        .join('users', 'teams.managerIdFk', 'users.id')
        .select('team_rules.id', 'teams.teamName', 'api.apiName', 'users.name')
      return teamsAmMember
    } catch (error) {
      throw new Error('Erro ao carregar a lista de Apis')
    }
  }

  /**
   * @description Exit Team, "don't need to own"
   * @param userId User ID
   * @param ruleId Rule ID
   */
  public async exitTeam (userId: number, ruleId: number): Promise<void> {
    try {
      const result = await this.api('team_rules').where({ id: ruleId, userIdFk: userId })

      if (result.length !== 0) {
        await this.api('team_rules').where({ id: ruleId, userIdFk: userId }).del()
      } else {
        throw new Error('Erro ao tentar sair desta equipe')
      }
    } catch (error) {
      throw new Error('Erro ao tentar sair da equipe')
    }
  }
}
