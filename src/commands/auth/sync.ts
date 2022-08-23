import { CliUx } from '@oclif/core'
import Command from '../../base'
import { ClickUpResponses } from "../../api/types";

export default class AuthSync extends Command {
  static description = 'synchronize stored settings for the known spaces - this includes statuses, priorities, etc';

  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ];

  public async run(): Promise<void> {
    CliUx.ux.prideAction.start('Syncing');
    const spaces = await this.clickup!.listSpaces();

    const mapping: Record<ClickUpResponses.Space['id'], string[]> = {};
    for (const space of spaces) {
      mapping[space.id] = space.statuses!.map(status => status.status);
    }

    await this.updateConfig({
      statuses: mapping,
      lastSync: +new Date(),
    });

    CliUx.ux.prideAction.stop();
    this.log(`Fetched ${spaces.length} spaces and ${Object.values(mapping).flat().length} statuses`);
  }
}
