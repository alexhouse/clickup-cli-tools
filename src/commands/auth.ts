import Command from '../base';
import { CliUx, Flags } from '@oclif/core'
import * as inquirer from 'inquirer';
import ClickUp from "../api/clickup";
import * as chalk from 'chalk';
import SetDefaultTeam from './auth/team';

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
      const { token: existingToken } = this.userConfig;
      CliUx.ux.open('https://app.clickup.com/settings/apps');
      CliUx.ux.log(`Create your token under ${chalk.green('ClickUp My Settings -> Apps')} and then copy it below`);

      const { token } = await inquirer.prompt([
        {
          type: 'password',
          name: 'token',
          message: 'Enter your generated ClickUp API token',
          suffix: existingToken ? chalk.gray(` (or press enter to use existing token)`) : '',
          default: existingToken,
        }
      ]);

      CliUx.ux.action.start('validating');
      const { username, id: userId } = await ClickUp.validateToken(token);
      CliUx.ux.action.stop();

      if (username) {
        await this.updateConfig({
          token,
          userId,
        });

        this.log(`Authenticated as ${username}`);
      } else {
        await this.updateConfig('token', undefined);

        this.warn('Invalid token');
        this.exit(1);
      }

      await SetDefaultTeam.run();

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
