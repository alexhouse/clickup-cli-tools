import { CliUx, Flags } from '@oclif/core'
import * as assert from "assert";
import Command from '../../base'
import * as Listr from 'listr';
import { exec, execSync } from 'child_process';

export default class TaskStart extends Command {
  static description = 'Start a ClickUp task. Checks out a branch and changes task status to DEVELOP'

  static examples = [
    '<%= config.bin %> <%= command.id %> TECH-1234',
    '<%= config.bin %> <%= command.id %> PROD-880 -b master',
  ]

  static flags = {
    base: Flags.string({ char: 'b', description: 'base branch to start from', default: 'develop' }),
    branchName: Flags.string({ char: 'n', description: 'custom branch name' }),
  }

  static args = [{ name: 'taskId' }];

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(TaskStart);

    const { taskId } = args;
    assert(taskId, 'You must provide a task id');

    const { base } = flags;
    let { branchName } = flags;

    const teamId = this.teamId();

    this.log(`viewing ${taskId} from ClickUp`);
    CliUx.ux.prideAction.start('Loading task');
    const task = await this.clickup!.retrieveTask(taskId, teamId);
    CliUx.ux.prideAction.stop();

    assert(task, 'Task not found with that ID');

    //`echo $summary | tr '[:upper:]' '[:lower:]' | tr '[:blank:]' '-' | tr -cd '[\-][:alpha:]'`
    if (!branchName) {
      branchName = `${task.custom_id}/${task.name.toLowerCase().replace(/\s/g, '-').replace(/[^a-zA-Z0-9-]/g, '')}`;
    }

    const cwd = process.cwd();
    const immoPath = process.env.IMMO_WORKSPACE_PATH;
    // assert(cwd === immoPath, 'You must be in the IMMO workspace');

    const startTasks = new Listr([
      {
        title: 'Fetching origin',
        task: async () => await exec([`cd "${immoPath}"`, 'git fetch origin -p'].join(' && ')),
      },
      {
        title: `Creating branch ${branchName} from origin/${base}`,
        task: async (ctx, task) => {
          try {
            const stdout = await execSync(
              [`cd "${immoPath}"`, ['git', 'checkout', '-b', `${branchName}`, `origin/${base}`, '--no-track'].join(' ')].join(' && ')
            );
          } catch (error: any) {
            if (error.status !== 0) {
              ctx.branchExists = true;
              task.skip(`Branch ${branchName} already exists`);
            }
          }
        },
      },
      {
        title: 'Checking out branch',
        enabled: (ctx) => ctx.branchExists,
        task: async (ctx, task) => {
          await exec([`cd "${immoPath}"`, ['git', 'checkout', `${branchName}`].join(' ')].join(' && '));
        },
      },
      {
        title: 'Updating task status',
        task: () => this.clickup!.startTask(task, 'in progress'),
      },
    ]).run().catch(err => {
      this.error(err);
      this.exit(0);
    });
  }
}
