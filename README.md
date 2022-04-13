clickup-cli-tools
=================

ClickUp CLI Tools

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/clickup-cli-tools.svg)](https://npmjs.org/package/clickup-cli-tools)
[![CircleCI](https://circleci.com/gh/alexhouse/clickup-cli-tools/tree/main.svg?style=shield)](https://circleci.com/gh/alexhouse/clickup-cli-tools/tree/main)
[![Downloads/week](https://img.shields.io/npm/dw/clickup-cli-tools.svg)](https://npmjs.org/package/clickup-cli-tools)
[![License](https://img.shields.io/npm/l/clickup-cli-tools.svg)](https://github.com/alexhouse/clickup-cli-tools/blob/main/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g clickup-cli-tools
$ clickup COMMAND
running command...
$ clickup (--version)
clickup-cli-tools/0.1.0 darwin-x64 node-v14.17.5
$ clickup --help [COMMAND]
USAGE
  $ clickup COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`clickup auth`](#clickup-auth)
* [`clickup help [COMMAND]`](#clickup-help-command)
* [`clickup plugins`](#clickup-plugins)
* [`clickup plugins:install PLUGIN...`](#clickup-pluginsinstall-plugin)
* [`clickup plugins:inspect PLUGIN...`](#clickup-pluginsinspect-plugin)
* [`clickup plugins:install PLUGIN...`](#clickup-pluginsinstall-plugin-1)
* [`clickup plugins:link PLUGIN`](#clickup-pluginslink-plugin)
* [`clickup plugins:uninstall PLUGIN...`](#clickup-pluginsuninstall-plugin)
* [`clickup plugins:uninstall PLUGIN...`](#clickup-pluginsuninstall-plugin-1)
* [`clickup plugins:uninstall PLUGIN...`](#clickup-pluginsuninstall-plugin-2)
* [`clickup plugins update`](#clickup-plugins-update)
* [`clickup start [TASKID]`](#clickup-start-taskid)
* [`clickup task list`](#clickup-task-list)
* [`clickup view [TASKID]`](#clickup-view-taskid)

## `clickup auth`

authenticate with ClickUp

```
USAGE
  $ clickup auth [-t] [-o] [--check]

FLAGS
  -o, --oauth  Auth using oauth
  -t, --token  Auth using a token
  --check      Check current authentication

DESCRIPTION
  authenticate with ClickUp

EXAMPLES
  $ clickup auth
```

_See code: [dist/commands/auth.ts](https://github.com/alexhouse/clickup-cli-tools/blob/v0.1.0/dist/commands/auth.ts)_

## `clickup help [COMMAND]`

Display help for clickup.

```
USAGE
  $ clickup help [COMMAND] [-n]

ARGUMENTS
  COMMAND  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for clickup.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.1.10/src/commands/help.ts)_

## `clickup plugins`

List installed plugins.

```
USAGE
  $ clickup plugins [--core]

FLAGS
  --core  Show core plugins.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ clickup plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v2.0.11/src/commands/plugins/index.ts)_

## `clickup plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ clickup plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.

  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.

ALIASES
  $ clickup plugins add

EXAMPLES
  $ clickup plugins:install myplugin 

  $ clickup plugins:install https://github.com/someuser/someplugin

  $ clickup plugins:install someuser/someplugin
```

## `clickup plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ clickup plugins:inspect PLUGIN...

ARGUMENTS
  PLUGIN  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ clickup plugins:inspect myplugin
```

## `clickup plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ clickup plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.

  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.

ALIASES
  $ clickup plugins add

EXAMPLES
  $ clickup plugins:install myplugin 

  $ clickup plugins:install https://github.com/someuser/someplugin

  $ clickup plugins:install someuser/someplugin
```

## `clickup plugins:link PLUGIN`

Links a plugin into the CLI for development.

```
USAGE
  $ clickup plugins:link PLUGIN

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Links a plugin into the CLI for development.

  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.

EXAMPLES
  $ clickup plugins:link myplugin
```

## `clickup plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ clickup plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ clickup plugins unlink
  $ clickup plugins remove
```

## `clickup plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ clickup plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ clickup plugins unlink
  $ clickup plugins remove
```

## `clickup plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ clickup plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ clickup plugins unlink
  $ clickup plugins remove
```

## `clickup plugins update`

Update installed plugins.

```
USAGE
  $ clickup plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

## `clickup start [TASKID]`

Start a ClickUp task. Checks out a branch and changes task status to DEVELOP

```
USAGE
  $ clickup start [TASKID] [-b <value>] [-n <value>]

FLAGS
  -b, --base=<value>        [default: develop] base branch to start from
  -n, --branchName=<value>  custom branch name

DESCRIPTION
  Start a ClickUp task. Checks out a branch and changes task status to DEVELOP

EXAMPLES
  $ clickup start TECH-1234

  $ clickup start PROD-880 -b master
```

_See code: [dist/commands/start.ts](https://github.com/alexhouse/clickup-cli-tools/blob/v0.1.0/dist/commands/start.ts)_

## `clickup task list`

List ClickUp tasks for your default team optionally filtered by space/folder/list or other criteria

```
USAGE
  $ clickup task list [-i | -s <value> | -f <value>] [-l <value>  ] [-a | -m] [--color] [--columns <value> |
    -x] [--sort <value>] [--filter <value>] [--output csv|json|yaml |  | [--csv | --no-truncate]] [--no-header | ]

FLAGS
  -x, --extended     show extra columns
  --[no-]color       Colorize output
  --columns=<value>  only show provided columns (comma-separated)
  --csv              output is csv format [alias: --output=csv]
  --filter=<value>   filter property by partial string matching, ex: name=foo
  --no-header        hide table header from output
  --no-truncate      do not truncate output to fit screen
  --output=<option>  output in a more machine friendly format
                     <options: csv|json|yaml>
  --sort=<value>     property to sort by (prepend '-' for descending)

FILTER FLAGS
  -a, --all             Show all tasks
  -f, --folder=<value>  Only show tasks in the given folder
  -l, --list=<value>    Only show tasks in the given list
  -m, --mine            Only show my tasks
  -s, --space=<value>   Only show tasks in the given space

INTERACTIVE MODE FLAGS
  -i, --interactive  Choose a space to list tasks in

DESCRIPTION
  List ClickUp tasks for your default team optionally filtered by space/folder/list or other criteria

EXAMPLES
  $ clickup task list # view your own tasks

  $ clickup task list --all # view all tasks

  $ clickup task list --interactive # use interactive mode to filter your tasks down to a list

  $ clickup task list --folder xyz # view your tasks in a folder

  $ clickup task list --list abc --all # view all tasks in a list
```

## `clickup view [TASKID]`

View a ClickUp ticket

```
USAGE
  $ clickup view [TASKID]

DESCRIPTION
  View a ClickUp ticket

EXAMPLES
  $ clickup view 12345
```

_See code: [dist/commands/view.ts](https://github.com/alexhouse/clickup-cli-tools/blob/v0.1.0/dist/commands/view.ts)_
<!-- commandsstop -->
