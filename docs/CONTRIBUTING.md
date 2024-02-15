# Contributing to this plugin

Feel free to contribute through issues and/or pull requests. I will try my best to address them in a timely manner, though I do not promise any indefinite support.

The instructions below are taken from [Basssiiie's Typescript Template](https://github.com/Basssiiie/OpenRCT2-Simple-Typescript-Template), though the template is slightly modified from the original.

## Adding more statistics

This plugin has been redesigned to offer easy extensibility for tracking new statistics. I suggest looking through `src/statistics/ridesBuilt.ts` to see an existing implementation.

### Steps for designing your own statistic widget:

1. Identify the stat you want to track & make sure there's a way to actually do that in the game.
    - Look through the `HookType` and `ActionType` types for ideas of what can be listened for/hooked into. For example, you can listen to just ride creation events by subscribe to `action.execute` and filter the events for those which are `ridecreate`.

2. (optional) Create a type to describe the shape of your statistic you're going to track. This should be a single instance of the stat, not a group or array of stats. If you're tracking the amount of time played, this could be `type TimeSpendStat = number`. If you're doing something more complicated, an object could be useful, e.g.
   ```ts
   type RideStat = {
     rideId: number;
     rideType: number;
     rideObject: number;
   };
5. Initialize a store with some default values based on your type. (These default values will never been used.)

   ```ts
   // the store that will hold the value of the statistic
   // initialized with a default value
   const newBuiltRide = store<RideStat>({
      rideId: -1,
      rideType: -1,
      rideObject: -1,
   });
4. Write a function that subscribes to the event you're trying to track (a ride being destroyed, a second passing, a piece of scenery being placed), and in that event callback set the value into your store.

   ```ts
   // function that tracks when the important event happens that we want to track
   // this function will subscribe to the hook when a ride is built
   // after doing some data processing, set the value of the store to the new value
   const subscribeToRideBuiltHook = () => {
     context.subscribe("action.execute", (e) => {
       // the event is very poorly typed, so having to cast it to the correct type
       const event = e as unknown as {
         action: ActionType;
         args: { flags: number; rideType: number; rideObject: number };
         result: { ride: number };
       };
       if (event.action == "ridecreate") {
         // if the event's flags are greater than zero, it means they weren't actually executed and should be ignored
         // sometimes the flags are overflowing to -2147483648, so we need to check for <= 0
         if (event.args.flags <= 0) {
           // can print the event if you want to see the flags and other data
           console.log(`Ride built: ${JSON.stringify(event)}`);
   
           // set the value of the store to the new ride
           newBuiltRide.set({
             rideId: event.result.ride,
             rideType: event.args.rideType,
             rideObject: event.args.rideObject,
           });
         }
       }
   
   });
   };

5. Write an accumulator function. This will give direction on how to add each new event's data into the existing list. This is where you'll give definition to how your data gets stored when any new event gets added. Here are two examples:

- For a widget tracking rides built:
  ```ts
   // function showing how to accumulate the new value into the existing value
   // in this case, we're just adding the new ride to the list of rides
   // in other cases, you might add the new value to the existing value
   // or set the keys/values in an object or map
   function accumulateNewRide(newRide: RideStat, existingRides: RideStat[]) {
     return [...existingRides, newRide];
   }

- For a widget tracking amount of time passed
  ```ts
  // each time the hook is called, we want to add 1 to the existing time value
   // the function expects that we'll do something with the new value and the existing value
   // but in this case, we're just going to ignore the new value and just add 1 to the existing value
   function accumulateSeconds(_newVal: TimeSpendStat, existingVal: TimeSpendStat) {
      return existingVal + 1;
   }

6. Write a function to define how the data should be processed before it's shown in the widget.

- For a widget tracking rides built
  ```ts
   // function that formats the value of the statistic for display
   // in this case, it's just the number of rides built
   // but I could see it being reformatted to show the names of the rides built or something else
   // and displayed in a different widget
   function formatDisplay(ridesBuilt: RideStat[]): string {
      const numberOfRides = Object.keys(ridesBuilt).length;
      return `${numberOfRides}`;
   }
- For a widget tracking amount of time passed
  ```ts
  function formatDisplay(totalSeconds: number): string {
  const SECONDS_IN_MINUTE = 60;
  const SECONDS_IN_HOUR = 3600;

  let result = "";
  let hours = Math.floor(totalSeconds / SECONDS_IN_HOUR);
  let minutes = Math.floor((totalSeconds % SECONDS_IN_HOUR) / SECONDS_IN_MINUTE);
  let seconds = totalSeconds % SECONDS_IN_MINUTE;

  if (hours > 0) {
     result += `${hours}h `;
  }
  if (hours > 0 || minutes > 0) {
     result += `${minutes < 10 ? "0" + minutes : minutes}m `;
  }
  result += `${seconds < 10 ? "0" + seconds : seconds}s`;

  return result;
  }
7. Write a function to start listening to your hook from #1, creating a Statistic object, and returning it.   
  ```ts
// function that creates the Statistic object and which is exported
  export const ridesBuiltStatistic = () => {
     const key = STATISTIC_KEY;
     const title = STATISTIC_TITLE;
     // the store that holds the value of the newest occurrence of the event
     const statStore = newBuiltRide;
   
      // call the function that subscribes to the hook
      subscribeToRideBuiltHook();
      
      // create the Statistic object and return it
      return new Statistic({
         key,
         title,
         statStore,
         resetValue: [],
         formatDisplay,
         accumulator: accumulateNewRide,
      });
   };
```

8. Finally, open `./src/startup.ts` and your new statistic into the file
- Call your exported function from #7
- Add it into the statController so a widget will be created
   ```ts
   // track how much time has been spent in the game
   const timeSpentStat = timeSpentStatistic();
   
   // track how many rides were built
   const ridesBuiltStat = ridesBuiltStatistic();
   
   // track how many vehicles have crashed
   const vehiclesCrashedStat = vehiclesCrashedStatistic();
   
   // add the statistics to the controller
   sc.add(timeSpentStat).add(ridesBuiltStat).add(vehiclesCrashedStat);



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
