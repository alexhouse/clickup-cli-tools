import axios, { AxiosInstance } from 'axios';
import * as fs from "fs-extra";
import { ClickUpRequests, ClickUpResponses } from './types';
import { ConfigProps } from "../base";

type ListTaskProps = {
  mine?: boolean;
  space?: string;
  folder?: string;
  list?: string;
  includeDone?: boolean;
};

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

  public async updateTask(taskId: string, changes: Partial<ClickUpRequests.Task>): Promise<ClickUpResponses.Task | undefined> {
    try {
      const { data } = await this.axios!.put(`/task/${taskId}`, changes);
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
    const { data: { spaces } } = await this.axios!.get(`/team/${this.config?.defaultTeam?.id}/space`);
    return spaces;
  }

  public async listTasks({
                           mine = false,
                           space,
                           folder,
                           list,
                           includeDone = false,
                         }: ListTaskProps): Promise<ClickUpResponses.Task[] | undefined> {
    let url = `/team/${this.config!.defaultTeam!.id}/task`;

    const params = new URLSearchParams({
      subtasks: 'true',
    });
    if (mine) {
      params.set('assignees[]', String(this.config!.userId!));
    }

    // if (!includeDone && space) {
      // this.config?.statuses?.[space]?.forEach(status => status.indexOf('done') === -1 && params.append('statuses[]', encodeURIComponent(status)));
    // }

    if (list) {
      const { data: { views } } = await this.axios!.get(`/list/${list}/view`);
      const taskViews = views.filter((view: ClickUpResponses.View) => view.type === 'board');
      if (taskViews.length > 0) {
        url = `/view/${taskViews[0].id}/task`;
      } else {
        url = `/list/${list}/task`;
      }
    } else {
      if (space) {
        params.set('space_ids[]', space);
      }
      if (folder) {
        params.set('folder_ids[]', folder);
      }
    }

    try {
      const { data: { tasks } } = await this.axios!.get(`${url}?${decodeURIComponent(params.toString())}`);
      return tasks;
    } catch (err) {
      console.error('Error fetching tasks', err);
    }
  }

  public async startTask(task: ClickUpResponses.Task, taskStatus: string): Promise<ClickUpResponses.Task | undefined> {
    let assignees = new Set(task.assignees?.map(assignee => assignee.id) ?? []);
    assignees.add(this.config!.userId!);

    try {
      const { data, status } = await this.axios!.put(`/task/${task.id}`, {
        status: taskStatus,
        assignees: Array.from(assignees),
      });

      if (status >= 200 && status < 300) {
        return data;
      } else {
        console.error(JSON.stringify(data));
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
