import Command from '../../base'
import * as assert from "assert";
import { CliUx } from "@oclif/core";

export default class TaskView extends Command {
  static description = 'View a ClickUp ticket'

  static examples = [
    '<%= config.bin %> <%= command.id %> 12345',
  ]

  static flags = {};
  static args = [{ name: 'taskId' }];

  public async run(): Promise<void> {
    const { args } = await this.parse(TaskView)

    const { taskId } = args;
    assert(taskId, 'You must provide a task id');

    const { id: teamId } = Command.userConfig.defaultTeam ?? {};
    assert(teamId, 'You must set a default team in your config');

    this.log(`viewing ${taskId} from ClickUp`);
    CliUx.ux.prideAction.start('Loading task');
    const task = await this.clickup!.retrieveTask(taskId, teamId);
    CliUx.ux.prideAction.stop();

    assert(task, 'Task not found');

    CliUx.ux.styledHeader(task.name);
    CliUx.ux.url(task.custom_id, task.url);
    CliUx.ux.info(`Status: ${task.status.status}`);
    CliUx.ux.info(`Desc  : ${task.description}`);
  }
}
