export declare module ClickUpResponses {
  export interface Status {
    id: string;
    status: string;
    color: string;
    orderindex: number;
    type: string;
  }

  export interface Priority {
    id: string;
    priority: string;
    color: string;
    orderindex: string;
  }

  export interface Option {
    id: string;
    name: string;
    color?: any;
    orderindex: number;
  }

  export interface TypeConfig {
    default?: number;
    placeholder?: any;
    options: Option[];
    new_drop_down?: boolean;
  }

  export interface CustomField {
    id: string;
    name: string;
    type: string;
    type_config: TypeConfig;
    date_created: string;
    hide_from_guests: boolean;
    value: string;
    required: boolean;
  }

  export interface List {
    id: string;
    name: string;
    access: boolean;

    orderindex: number;
    status: string | null;
    priority: Priority | null;
    assignee: User | null;
    task_count: number;
    due_date: string;
    start_date: string;
    folder: Folder;
    space: Space;
    archived: boolean;
    override_statuses: boolean;
    permission_level: string;
  }

  export interface Project {
    id: string;
    name: string;
    hidden: boolean;
    access: boolean;
  }

  export interface Folder {
    id: string;
    name: string;
    hidden: boolean;
    access: boolean;
  }

  export interface Space {
    id: string;
    name?: string;
    private?: boolean;
    statuses?: Status[];
    multiple_assignees?: boolean;
    features?: Features;
    archived?: boolean;
  }

  export interface View {
    id: string;
    name: string;
    type: 'doc' | 'board';
    date_created: string;
    creator: number;
    visibility: string;
    protected: boolean;
    protected_note?: string;
    protected_by?: string;
    date_protected?: string;
    orderindex?: string;
  }

  export type Task = {
    id: string;
    custom_id: string;
    name: string;
    text_content: string;
    description: string;
    status: Status;
    orderindex: string;
    date_created: string;
    date_updated: string;
    date_closed?: any;
    archived: boolean;
    creator: User;
    assignees: User[];
    watchers: User[];
    checklists: any[];
    tags: any[];
    parent?: any;
    priority: Priority;
    due_date?: any;
    start_date?: any;
    points?: any;
    time_estimate?: any;
    time_spent: number;
    custom_fields: CustomField[];
    dependencies: any[];
    linked_tasks: any[];
    team_id: string;
    url: string;
    permission_level: string;
    list: List;
    project: Project;
    folder: Folder;
    space: Space;
    attachments: any[];
  }

  export interface User {
    id: number;
    username: string;
    email: string;
    color: string;
    profilePicture: string;
    initials?: string;
    role?: number;
    custom_role?: any;
    last_active?: string;
    date_joined?: string;
    date_invited?: string;
    week_start_day?: number;
    global_font_support?: boolean;
    timezone?: string;
  }

  export interface Member {
    user: User;
    invited_by: User;
    can_see_time_spent?: boolean;
    can_see_time_estimated?: boolean;
    can_see_points_estimated?: boolean;
    can_edit_tags?: boolean;
  }

  export interface Team {
    id: string;
    name: string;
    color: string;
    avatar: string;
    members: Member[];
  }

  export interface Teams {
    teams: Team[];
  }

  export interface DueDates {
    enabled: boolean;
    start_date: boolean;
    remap_due_dates: boolean;
    remap_closed_due_date: boolean;
  }

  export interface Sprints {
    enabled: boolean;
  }

  export interface TimeTracking {
    enabled: boolean;
    harvest: boolean;
    rollup: boolean;
  }

  export interface Points {
    enabled: boolean;
  }

  export interface CustomItems {
    enabled: boolean;
  }

  export interface Priority {
    id: string;
    priority: string;
    color: string;
    orderindex: string;
  }

  export interface Priorities {
    enabled: boolean;
    priorities: Priority[];
  }

  export interface Tags {
    enabled: boolean;
  }

  export interface CheckUnresolved {
    enabled: boolean;
    subtasks?: any;
    checklists?: any;
    comments?: any;
  }

  export interface Zoom {
    enabled: boolean;
  }

  export interface Milestones {
    enabled: boolean;
  }

  export interface CustomFields {
    enabled: boolean;
  }

  export interface DependencyWarning {
    enabled: boolean;
  }

  export interface MultipleAssignees {
    enabled: boolean;
  }

  export interface Emails {
    enabled: boolean;
  }

  export interface Features {
    due_dates: DueDates;
    sprints: Sprints;
    time_tracking: TimeTracking;
    points: Points;
    custom_items: CustomItems;
    priorities: Priorities;
    tags: Tags;
    check_unresolved: CheckUnresolved;
    zoom: Zoom;
    milestones: Milestones;
    custom_fields: CustomFields;
    dependency_warning: DependencyWarning;
    multiple_assignees: MultipleAssignees;
    emails: Emails;
  }
}

