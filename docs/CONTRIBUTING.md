# Contributing to this plugin

Feel free to contribute through issues and/or pull requests. I will try my best to address them in a timely manner, though I do not promise any indefinite support.

The instructions below are taken from [Basssiiie's Typescript Template](https://github.com/Basssiiie/OpenRCT2-Simple-Typescript-Template), though the template is slightly modified from the original.

## How to start

1. Install dependencies using `npm`
2. Clone this repository to your computer through git.
3. Open a terminal or command prompt.
4. Use `cd` to change your current directory to the root folder of this project.
5. Run `npm ci` to install the project's dependencies.
6. Use the `openrct2.d.ts` TypeScript API declaration file for v0.4.7 and copy it to `./lib/` folder.
   - This file can usually be found in the [OpenRCT2 installation directory](#openrct2-installation-directory).
   - Alternatively you can [download it from here](https://raw.githubusercontent.com/OpenRCT2/OpenRCT2/v0.4.7/distribution/openrct2.d.ts).

## Dependencies

The following libraries and tools are used for development:

- **NodeJS** is the JavaScript engine used to develop and run code when the game is not running.
- **NPM** is a library and package manager for JavasScript and TypeScript and can be used to install new packages and update existing packages in the project.
- **TypeScript** is a expansion language to JavaScript that adds type checking when you are writing the code. It allows you to specify rules for how objects and values look like, so TypeScript can report back if your code follows these rules (instead of crashes or errors in-game).
- **Rollup** bundles all source code, runs it through some plugins like TypeScript, and then outputs a single JavaScript plugin file.
- **Nodemon** is the program that can watch a folder for changes and then trigger a specified action. It is used by `npm start` to watch the `./src/` folder and triggers `npm run build:dev` if any changes occur.

---

## Commands

Multiple commands are detailed below to help with development. They output files to different directories, which can be changed in `rollup.config.js`. Be sure to not commit any changes you should make to the output paths.

### Create release build

`npm run build`

This version is optimized for sharing with others, using Terser to make the file as small as possible. By default, the plugin will be outputted to `./dist/`.

### Create dev build

`npm run build:dev`

This version is not optimized for sharing, but easier to read in case you want to see the outputted Javascript. By default, the plugin will be outputted in the plugin folder of the default [OpenRCT2 user directory](#openrct2-user-directory).

### Run script to automatically create dev builds

`npm start` or `npm run start`

Will start a script that will automatically run `npm run build:dev` every time you make a change to any Typescript or Javascript file inside the `./src/` folder.

---

## Access game logs

When your plugin is not loading properly, it may be useful to be able to read the logs of the game to see if there are any errors. Furthermore, if you use the `console.log` function, the resulting logs can be read here as well.

### Windows

1. Navigate to the folder where [OpenRCT2 is installed](#openrct2-installation-directory).
2. Launch the `openrct2.com` file located there (the MS-DOS application).
	- If file extensions are hidden, make sure to [enable them](https://support.microsoft.com/en-us/windows/common-file-name-extensions-in-windows-da4a4430-8e76-89c5-59f7-1cdbbc75cb01).

### MacOS

1. Launch a terminal or another command-line prompt.
2. Using the `cd` command, navigate to the folder where [OpenRCT2 is installed](#openrct2-installation-directory).
3. Run `open OpenRCT2.app/Contents/MacOS/OpenRCT2` to launch OpenRCT2 with logging enabled.

### Linux

1. Launch a terminal or another command-line prompt.
2. Using the `cd` command, navigate to the folder where [OpenRCT2 is installed](#openrct2-installation-directory).
3. Run `./openrct2` to launch OpenRCT2 with logging enabled.

---

## Hot reload

This project supports [OpenRCT2's hot reload feature](https://github.com/OpenRCT2/OpenRCT2/blob/master/distribution/scripting.md#writing-scripts).

1. Navigate to your [OpenRCT2 user directory](#openrct2-user-directory) and open the `config.ini` file.
2. Enable hot reload by setting `enable_hot_reloading = true` in `config.ini`.
3. Run `npm start` in the directory of this project to start the hot reload server.
4. Start the OpenRCT2 and load a save or start a new game.
5. Each time you save any of the files in `./src/`, the server will compile `./src/registerPlugin.ts` and place compiled plugin file inside your local OpenRCT2 plugin directory.
6. OpenRCT2 will notice file changes and it will reload the plugin.

---

## Folders

### OpenRCT2 installation directory

This is the directory where the game is installed.

- **Windows:** usually `C:/Users/<USERNAME>/Documents/OpenRCT2/bin/` when using the launcher or `C:/Program Files/OpenRCT2/` when an installer was used.
- **MacOS:** the folder where the `OpenRCT2.app` application file was placed.
- **Linux:** depends on the distro, but likely either `/usr/share/openrct2` when installed through a package manager, or mounted in `/tmp` when using an AppImage.

### OpenRCT2 user directory

This is the directory where the game stores user data, like save games and plugins.

- **Windows:** usually `Documents/OpenRCT2/` or `C:/Users/<USERNAME>/Documents/OpenRCT2/`.
- **MacOS:** usually `/Users/<USERNAME>/Library/Application Support/OpenRCT2/`. Note that `Library` is a hidden folder in your user directory, so by default it will not show up in Finder.
- **Linux:** usually `/home/<USERNAME>/.config`, `$HOME/.config`, or where the environment variable `$XDG_CONFIG_HOME` points to if it's set.

You can also open this folder from inside OpenRCT2, by selecting "Open custom content folder" in the dropdown under the red toolbox in the main menu.
