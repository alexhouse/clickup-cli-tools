import { Flags } from '@oclif/core';
import { ClickUpResponses } from '../../api/types';
import Command from '../../base';
import * as inquirer from "inquirer";
import * as chalk from "chalk";
import AuthSync from "../auth/sync";

export default class TaskUpdate extends Command {
  static description = 'describe the command here';

  static examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> --status done PROD-1234',
  ];

  static flags = {
    status: Flags.string({ char: 's', description: 'new status to change to' }),
  };

  static args = [{
    name: 'id',
    optional: true,
  }];

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(TaskUpdate)

    const { id } = args;
    let { status } = flags;

    if (!id) {
      this.error('No ID provided');
      this.exit(1);
    }
    const task = await this.clickup?.retrieveTask(id, Command.userConfig.defaultTeam!.id);
    if (!task) {
      this.error('This task does not appear to exist - are you sure the ID is correct?');
      this.exit(404);
    }

    if (!status) {
      status = await this.chooseStatus(task);
    }

    this.log(`Updating ${task.custom_id} with status ${status}`);
    await this.clickup?.updateTask(task.id, { status });
  }

  private async chooseStatus(task: ClickUpResponses.Task): Promise<string> {
    const statuses = task.space.statuses;
    let statusMap: Array<{name: string, value: string}> = [];

    if (statuses) {
      statusMap = statuses.map(status => ({
        name: status.status,
        value: chalk.hex(status.color).bold(status.status),
      }));
    } else if (Command.userConfig?.statuses && task.space.id in Command.userConfig.statuses) {
      await AuthSync.run();
      statusMap = Command.userConfig.statuses[task.space.id].map(status => ({
        name: status,
        value: status,
      }));
    }

    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'status',
        message: 'Choose a status',
        choices: statusMap
      }
    ]);
    return answers.status;
  }
}
