// src/base.ts
import { CliUx, Command } from '@oclif/core'
import * as fs from "fs-extra";
import * as path from "path";
import ClickUp from "./api/clickup";
import * as assert from "assert";
import * as chalk from 'chalk';
import { ClickUpResponses } from "./api/types";

export type ConfigProps = {
  token?: string;
  defaultTeam?: {
    id: string;
    name: string;
  };
  userId?: ClickUpResponses.User['id'];
  statuses?: Record<ClickUpResponses.Space['id'], string[]>;
  lastSync?: number;
}

export default abstract class extends Command {
  public userConfig: ConfigProps = {};
  public clickup?: ClickUp;

  async init() {
    // do some initialization
    const configPath = path.join(this.config.configDir, 'config.json');
    if (fs.existsSync(configPath)) {
      this.log(chalk.hidden(`Loading user configuration from ${configPath}`));
      this.userConfig = await fs.readJSON(configPath) ?? {};
    }

    if (this.userConfig?.userId) {
      ClickUp.init(this.userConfig);
      this.clickup = ClickUp.getInstance();
    }
  }

  protected async updateConfig(key: ConfigProps | keyof ConfigProps, val?: any) {
    if (!val && typeof key === 'object') {
      this.userConfig = {
        ...this.userConfig,
        ...key
      };
    } else if (typeof key === 'string') {
      this.userConfig[key] = val;
    }

    if (!fs.pathExistsSync(this.config.configDir)) {
      await fs.mkdirp(this.config.configDir);
    }

    await fs.writeJSON(path.join(this.config.configDir, 'config.json'), this.userConfig);
  }

  protected async showProgress<T>(message: string, action: () => Promise<T>): Promise<T> {
    CliUx.ux.action.start(message);
    const response = await action();
    CliUx.ux.action.stop();

    return response;
  }

  protected teamId(): string {
    assert(this.userConfig.defaultTeam, 'You must set a default team in your config');
    const { id } = this.userConfig.defaultTeam!;
    return id;
  }
}
