import Command from '../../base';
import { CliUx } from '@oclif/core'
import ClickUp from "../../api/clickup";
import * as inquirer from "inquirer";

export default class AuthTeam extends Command {
  static description = 'choose your default team'

  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static args = [{ name: 'teamName', description: 'The name of the team you would like to set as default' }];

  public async run(): Promise<void> {
    CliUx.ux.action.start('Fetching teams');
    const teams = await ClickUp.getInstance().listTeams();
    CliUx.ux.action.stop();

    const { team } = await inquirer.prompt([
      {
        type: 'list',
        name: 'team',
        message: 'Choose your default team',
        choices: teams.map(team => ({ value: { id: team.id, name: team.name }, name: team.name })),
        default: teams[0]?.name,
      }
    ]);

    if (team) {
      this.log(`Setting default team to ${team.name} (${team.id})`);
      await this.updateConfig('defaultTeam', { id: team.id, name: team.name });
    }
  }
}
