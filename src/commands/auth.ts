import Command from '../base';
import { Flags, CliUx } from '@oclif/core'
import * as inquirer from 'inquirer';
import ClickUp from "../api/clickup";
import * as chalk from 'chalk';

export default class Auth extends Command {
  static description = 'authenticate with ClickUp'

  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static flags = {
    // flag with a value (-n, --name=VALUE)
    token: Flags.boolean({ char: 't', description: 'Auth using a token' }),
    // flag with no value (-f, --force)
    oauth: Flags.boolean({ char: 'o', description: 'Auth using oauth' }),
    check: Flags.boolean({ description: 'Check current authentication' }),
  }

  public async run(): Promise<void> {
    const { flags } = await this.parse(Auth)

    if (flags.check) {
      return this.checkAuth();
    }

    if (!flags.token && !flags.oauth) {
      const answers = await inquirer.prompt([
        {
          type: 'list',
          name: 'auth',
          message: 'How would you like to authenticate?',
          choices: ['token', 'oauth'],
        },
      ]);

      if (answers.auth === 'token') {
        flags.token = true
      } else {
        flags.oauth = true
      }
    }

    if (flags.token) {
      const {token: existingToken} = this.userConfig;
      const { token } = await inquirer.prompt([
        {
          type: 'password',
          name: 'token',
          message: 'Enter your generated ClickUp API token',
          default: existingToken,
        }
      ]);

      CliUx.ux.action.start('validating');
      const { username, id: userId } = await ClickUp.validateToken(token);
      CliUx.ux.action.stop();

      if (username) {
        await this.updateConfig('token', token);
        await this.updateConfig('userId', userId)
        this.log(`Authenticated as ${username}`);
      } else {
        await this.updateConfig('token', undefined);
        this.warn('Invalid token');
        this.exit(1);
      }

      CliUx.ux.action.start('Fetching teams');
      const teams = await ClickUp.getInstance().listTeams();
      CliUx.ux.action.stop();

      const { team } = await inquirer.prompt([
        {
          type: 'list',
          name: 'team',
          message: 'Choose your default team',
          choices: teams.map(team => ({value: {id: team.id, name: team.name}, name: team.name})),
          default: teams[0]?.name,
        }
      ])

      if (team) {
        this.log(`Setting default team to ${team.name} (${team.id})`);
        await this.updateConfig('defaultTeam', { id: team.id, name: team.name });
      }

      this.log('All set!');
    }
  }

  private async checkAuth() {
    try {
      const user = await this.clickup!.currentUser();
      this.log(`Authenticated as ${chalk.hex(user.color).bold(user.username)}`);
    } catch (err) {
      this.error(chalk.red('You are not currently authenticated'), { exit: 100 });
    }
  }
}
