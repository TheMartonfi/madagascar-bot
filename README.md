# Madagascar Bot

Madagascar bot is a discord bot built in typescript that allows users to store meme commands and create speedrun.com notifications for new verified runs for a specific game/category. The bot keeps all it's data per server.

## Getting Started

You need to have administrator privileges to add a bot to your discord.
Use this link to invite the bot to the server of your choice: https://discord.com/oauth2/authorize?client_id=799002591781584927&scope=bot&permissions=3263488

## Dependencies

- NodeJS
- Typescript
- Postgresql

## Commands guide

- `!help` Link to this repo.

- `!commands` List of global commands. (Words surrounded with quotes are arguments)

- `!memes` Lists all memes for the server.

- `!add meme "name" "file"` The "name" argument will be the command name for the meme, the file argument should either be a string of text or a file upload.
  ['Add meme'](https://github.com/TheMartonfi/polylog-app/blob/main/docs/lectures.png?raw=true)

- `!edit meme "oldName" "newName"` Modifies the name of an existing meme command.
  ['Edit meme'](https://github.com/TheMartonfi/polylog-app/blob/main/docs/lectures.png?raw=true)

- `!delete meme "name"` Deletes meme if it exists.
  ['Delete meme'](https://github.com/TheMartonfi/polylog-app/blob/main/docs/lectures.png?raw=true)

- `!search meme "name"` Returns a list of meme names matching the search term. The bot will invoke the meme command if it only returns one result.
  ['Search meme'](https://github.com/TheMartonfi/polylog-app/blob/main/docs/lectures.png?raw=true)

- `!notifications` Lists all current speedrun.com notifications.

- `!add src "abbreviation" "categoryName"` Adds notifications in current channel for all new verified runs from src. If the category name is omitted you will be getting notifications for all categories for the game. The src abbreviation can be found by navigating to the leaderboard page on src and looking at the last word in the url. For the game Banjo-Kazooie the url looks like this: https://www.speedrun.com/bk and the abbreviation is bk. Please keep in mind to prevent duplicate notifications that you can only add all game category notifications if you are not currently getting notifications for a specific category of that game.
  <!-- Screenshot -->

  ['Add src'](https://github.com/TheMartonfi/polylog-app/blob/main/docs/lectures.png?raw=true)

- `!delete src "abbreviation" "categoryName` Deletes src notification if it exists.
  ['Delete src'](https://github.com/TheMartonfi/polylog-app/blob/main/docs/lectures.png?raw=true)

- Example notification for a new run!['Src notification'](https://github.com/TheMartonfi/polylog-app/blob/main/docs/lectures.png?raw=true)
