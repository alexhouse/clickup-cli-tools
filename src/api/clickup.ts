import axios, { AxiosInstance } from 'axios';
import * as fs from "fs-extra";
import { ClickUpResponses } from './types';
import { ConfigProps } from "../base";

class ClickUp {
  private static instance: ClickUp;
  private axios?: AxiosInstance;
  private config?: ConfigProps;

  private constructor({ configPath, ...config }: { configPath?: string } & ConfigProps) {
    if (configPath) {
      this.loadConfig(configPath)
        .then(() => this.createAxios());
    } else {
      this.config = config;
      this.createAxios();
    }
  }

  public static init(userConfig: ConfigProps) {
    if (!ClickUp.instance) {
      if (userConfig.token) {
        ClickUp.instance = new ClickUp(userConfig);
      }
    }
  }

  public static getInstance() {
    if (!ClickUp.instance) {
      throw new Error('ClickUp instance not initialized');
    }
    return ClickUp.instance;
  }

  public static async validateToken(token: string): Promise<ClickUpResponses.User> {
    const instance = new ClickUp({ token })
    return await instance.currentUser();
  }

  public async currentUser(): Promise<ClickUpResponses.User> {
    const { data } = await this.axios!.get('/user');
    return data?.user;
  }

  public async retrieveTask(taskId: string, teamId: string): Promise<ClickUpResponses.Task | undefined> {
    try {
      const { data } = await this.axios!.get(`/task/${taskId}?custom_task_ids=true&team_id=${teamId}`);
      return data;
    } catch (error) {
      console.error('API failed');
      console.error(JSON.stringify(error));
    }
  }

  public async getSpace(spaceId: string): Promise<ClickUpResponses.Space> {
    const { data } = await this.axios!.get(`/space/${spaceId}`);
    return data;
  }

  public async listLists(folderId: string): Promise<ClickUpResponses.List[]> {
    const { data } = await this.axios!.get(`/folder/${folderId}/list`);
    return data.lists;
  }

  public async listFolders(spaceId: string): Promise<ClickUpResponses.Folder[]> {
    const { data } = await this.axios!.get(`/space/${spaceId}/folder`);
    return data.folders;
  }

  public async listSpaces(): Promise<ClickUpResponses.Space[]> {
    const { data } = await this.axios!.get(`/team/${this.config?.defaultTeam?.id}/space`);
    return data.spaces;
  }

  public async listTasks({
                           mine = false,
                           space,
                           folder,
                           list
                         }: { mine?: boolean, space?: string, folder?: string, list?: string }): Promise<ClickUpResponses.Task[] | undefined> {

    const params = new URLSearchParams();
    let url = `/team/${this.config!.defaultTeam!.id}/task`;

    if (mine) {
      params.set('assignees[]', this.config!.userId!);
    }

    if (list) {
      url = `/list/${list}/task`;
    } else {
      if (space) {
        params.set('space_ids[]', space);
      }
      if (folder) {
        params.set('folder_ids[]', folder);
      }
    }

    const { data } = (await this.axios!.get(`${url}?${decodeURIComponent(params.toString())}`));

    return data.tasks;
  }

  public async startTask(task: ClickUpResponses.Task, taskStatus: string): Promise<ClickUpResponses.Task | undefined> {
    let assignees = new Set(task.assignees?.map(assignee => assignee.id) ?? []);
    assignees.add(parseInt(this.config!.userId!));

    try {
      const { data, status } = await this.axios!.put(`/task/${task.id}`, {
        status: taskStatus,
        assignees: Array.from(assignees),
      });

      if (status >= 200 && status < 300) {
        return data;
      }
    } catch (error) {
      console.error('API failed');
      console.error(JSON.stringify(error));
    }
  }

  public async listTeams(): Promise<ClickUpResponses.Team[]> {
    try {
      const { data } = await this.axios!.get('/team');
      return (data as ClickUpResponses.Teams).teams;
    } catch (error) {
      console.error('API failed');
      console.error(JSON.stringify(error));
    }

    return [];
  }

  private async loadConfig(configPath: string) {
    this.config = await fs.readJson(configPath) as ConfigProps;
  }

  private createAxios() {
    this.axios = axios.create({
      baseURL: 'https://api.clickup.com/api/v2',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${this.config!.token}`,
      },
    });
  }
}

export default ClickUp;
