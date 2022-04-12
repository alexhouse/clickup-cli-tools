import axios, { AxiosInstance } from 'axios';
import * as fs from "fs-extra";
import { ClickUpResponses } from './types';
import { ConfigProps } from "../base";

class ClickUp {
  private static instance: ClickUp;
  private axios?: AxiosInstance;
  private configPath?: string;
  private token?: string;
  private userId?: string;

  private constructor({ configPath, token, userId }: { configPath?: string } & ConfigProps) {
    if (configPath) {
      this.configPath = configPath;
      this.loadConfig()
        .then(() => this.createAxios());
    } else {
      this.token = token;
      this.userId = userId;
      this.createAxios();
    }
  }

  public static init(userConfig: ConfigProps) {
    if (!ClickUp.instance) {
      if (userConfig.token) {
        ClickUp.instance = new ClickUp({ token: userConfig.token, userId: userConfig.userId });
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
    try {
      const { data } = await this.axios!.get('/user');
      return data?.user;
    } catch (error) {
      console.error('API failed');
      console.error(JSON.stringify(error));
    }

    return {} as ClickUpResponses.User;
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

  public async getSpace(spaceId: string): Promise<ClickUpResponses.Space | undefined> {
    try {
      const { data } = await this.axios!.get(`/space/${spaceId}`);
      return data;
    } catch (error) {
      console.error('API failed');
      console.error(JSON.stringify(error));
    }
  }

  public async startTask(task: ClickUpResponses.Task, taskStatus: string): Promise<ClickUpResponses.Task | undefined> {
    let assignees = new Set(task.assignees?.map(assignee => assignee.id) ?? []);
    assignees.add(parseInt(this.userId!));

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

  private async loadConfig() {
    if (!this.configPath) {
      return;
    }

    const config = await fs.readJson(this.configPath) as ConfigProps;
    this.token = config.token;
    this.userId = config.userId;
  }

  private createAxios() {
    this.axios = axios.create({
      baseURL: 'https://api.clickup.com/api/v2',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${this.token}`,
      },
    });
  }
}

export default ClickUp;
