import { CliUx, Flags } from '@oclif/core'
import Command from '../../base';
import { ClickUpResponses } from "../../api/types";
import * as inquirer from "inquirer";
import * as chalk from 'chalk'
import { OutputFlags } from "@oclif/core/lib/interfaces";

const hyperlinker = require('hyperlinker');

export default class TaskList extends Command {
  static description = 'List ClickUp tasks for your default team optionally filtered by space/folder/list or other criteria';

  static examples = [
    '<%= config.bin %> <%= command.id %> # view your own tasks',
    '<%= config.bin %> <%= command.id %> --all # view all tasks',
    '<%= config.bin %> <%= command.id %> --interactive # use interactive mode to filter your tasks down to a list',
    '<%= config.bin %> <%= command.id %> --folder xyz # view your tasks in a folder',
    '<%= config.bin %> <%= command.id %> --list abc --all # view all tasks in a list',
  ]

  static flags = {
    interactive: Flags.boolean({
      char: 'i',
      description: 'Choose a space to list tasks in',
      // exclusive: ['space', 'folder'],
      helpGroup: 'interactive mode'
    }),
    space: Flags.string({
      char: 's',
      description: 'Only show tasks in the given space',
      helpGroup: 'filter'
    }),
    folder: Flags.string({
      char: 'f',
      description: 'Only show tasks in the given folder',
      dependsOn: ['space'], helpGroup: 'filter'
    }),
    list: Flags.string({
      char: 'l',
      description: 'Only show tasks in the given list',
      dependsOn: ['space', 'folder'], helpGroup: 'filter'
    }),
    mine: Flags.boolean({ char: 'm', description: 'Only show my tasks', default: true, helpGroup: 'filter' }),
    all: Flags.boolean({
      char: 'a',
      description: 'Show all tasks',
      default: false,
      exclusive: ['mine'],
      helpGroup: 'filter'
    }),
    includeDone: Flags.boolean({ description: 'Include completed tasks', default: false, helpGroup: 'filter' }),

    color: Flags.boolean({ description: 'Colorize output', default: true, allowNo: true }),
    ...CliUx.ux.table.flags(),
  }

  public async run(): Promise<void> {
    const { flags } = await this.parse(TaskList)

    if (flags.all) {
      flags.mine = false;
    }

    if (flags.interactive) {
      await this.interactive(flags);
    }

    CliUx.ux.prideAction.start('Fetching tasks');
    const { mine, space, folder, list, includeDone } = flags;
    const tasks = await this.clickup!.listTasks({ mine, space, folder, list, includeDone })
      .then(tasks => tasks?.sort((a, b) => a.status.orderindex - b.status.orderindex))
    CliUx.ux.prideAction.stop();

    CliUx.ux.table(tasks!, {
      id: {
        header: 'ID',
        minWidth: 5,
        get: (task: ClickUpResponses.Task) => chalk.dim(hyperlinker(task.custom_id, task.url)),
      },
      priority: {
        header: 'Priority',
        get: (task: ClickUpResponses.Task) => chalk.hex(task.priority?.color ?? chalk.visible).bold(task.priority?.priority ?? '?'),
      },
      name: {
        header: 'Name',
        minWidth: 20,
      },
      assignees: {
        header: 'Assignees',
        get: (task: ClickUpResponses.Task) => task.assignees.map(a => a.username).join(', '),
        extended: flags.mine,
      },
      list: {
        header: 'List',
        get: (task: ClickUpResponses.Task) => task.list.name,
      },
      folder: {
        header: 'Folder',
        get: (task: ClickUpResponses.Task) => task.folder.name,
        extended: true,
      },
      status: {
        header: 'Status',
        get: (task: ClickUpResponses.Task) => `(${task.status.orderindex}) ${chalk.hex(task.status.color).bold(task.status.status)}`,
      }
    }, {
      printLine: this.log.bind(this),
      ...flags, // parsed flags
    });
  }

  /**
   * Perform the interactive flag flow
   * @param {typeof TaskList.flags} flags
   * @private
   */
  private async interactive(flags: OutputFlags<any>) {
    const ui = new inquirer.ui.BottomBar();
    const spaces = (await this.clickup!.listSpaces()).map(space => ({
      name: space.name,
      value: space,
    }));

    const initialAnswers: any = {};
    if (flags.space) {
      const space = spaces.find(s => s.name === flags.space);
      if (space) {
        initialAnswers.space = space.value;

        if (flags.folder) {
          const folder = (await this.clickup!.listFolders(space.value.id)).find(folder => folder.name === flags.folder);
          if (folder) {
            initialAnswers.folder = folder;
          }
        }
      }
    }

    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'space',
        message: 'Choose a space to list tasks in',
        choices: spaces,
      },
      {
        type: 'list',
        name: 'folder',
        message: 'Choose a folder within the space',
        choices: async (answers) => {
          ui.log.write(`Loading folders in the ${answers.space.name} space...`);
          const folders = await this.clickup!.listFolders(answers.space.id);

          return [
            ...folders.map(folder => ({
              name: folder.name,
              value: folder,
            })),
          ];
        },
      },
      {
        type: 'list',
        name: 'list',
        message: 'Choose a list within the folder',
        choices: async (answers) => {
          ui.log.write(`Loading lists in the ${answers.folder.name} folder...`);
          const lists = await this.clickup!.listLists(answers.folder.id);

          return [
            ...lists.map(list => ({
              name: `${list.name} (${list.task_count} tasks)`,
              short: list.name,
              value: list,
            })),
          ];
        }
      }
    ], initialAnswers);

    flags.space = answers.space.id;
    flags.folder = answers.folder.id;
    flags.list = answers.list.id;
  }
}
