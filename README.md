---

# Discord Chatbot Project

## Introduction
This Discord chatbot, built using Node.js and Discord.js, provides various functionalities such as fetching YouTube videos, anime information, weather updates, generating ASCII art, and more.

## Features
- **YouTube Commands:**
  - **/artist**: Search for videos by a specific artist.
  - **/country**: Get top trending YouTube videos of a specific country.
  - **/youtube24h**: List videos with the most views in the last 24 hours.
  - **/youtube-trending**: Fetch top trending YouTube videos.
- **Anime Commands:**
  - **/anime**: Search for information about a specific anime.
  - **/character**: Search for information about a specific character.
  - **/character_search**: Search for anime series that contain a specific character.
  - **/manga**: Search for information about a specific manga.
  - **/search**: Search anime by image. (Supports maximum file size of 25MB)
  - **/staff**: Search for information about a specific staff.
  - **/studio**: Get information about the studio and a list of anime produced by the studio.
  - **/trending**: Get a list of trending anime on AniList.
- **Other Commands:**
  - **/switch**: Switch between different channels or languages.
  - **/language**: Change the language settings for the bot.
  - **/ascii**: Generate ASCII art.
  - **/weather**: Get weather updates for a specific location.

## Requirements

- Node.js v16.x or higher
- Discord.js v13.x

Make sure you have Node.js installed on your system. You can download it from [Node.js official website](https://nodejs.org/).

This bot is built with Discord.js version 13.x, which requires Node.js version 16.x or newer. If you're using an older version of Node.js, you'll need to update it to run this bot.

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/tiendk195/MTien_DiscordBot.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   - Create a `.env` file in the root directory.
   - Add your Discord bot token to the `.env` file:
     ```
     BOT_TOKEN=your-discord-bot-token
     ```
4. Start the bot:
   ```bash
   npm start
   ```

## Usage
1. Invite the bot to your Discord server.
2. Use the available commands to interact with the bot:
   - For YouTube commands, use `/artist`, `/country`, `/youtube24h`, or `/youtube-trending`.
   - For Anime commands, use `/anime`, `/character`, `/character_search`, `/manga`, `/search`, `/staff`, `/studio`, or `/trending`.
   - For other commands, use `/switch`, `/language`, `/ascii`, or `/weather`.

## Deploying to Render
You can deploy this bot to Render by clicking the button below:

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/tiendk195/MTien_DiscordBot)

Make sure to follow the instructions during deployment. Ensure that you have set up the required environment variables as described in the installation section.

## Contributing
Contributions are welcome! If you'd like to contribute to this project, please follow these steps:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature/new-feature`).
3. Make your changes.
4. Commit your changes (`git commit -am 'Add new feature'`).
5. Push to the branch (`git push origin feature/new-feature`).
6. Create a new Pull Request.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact
For any inquiries or feedback, feel free to contact the project maintainer at [tiendk195@gmail.com](mailto:tiendk195@gmail.com).

---
