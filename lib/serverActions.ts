"use server";
const { exec } = require("node:child_process");

export const createAllArchivedGames = async () => {
  for (let i = 3458; i <= 3458; i++) {
    const scrape = exec(
      `python ./lib/scraper.py ${i}`,
      (error: any, stdout: any, stderr: any) => {
        if (error) {
          console.log(`error: ${error.message}`);
          return;
        }
        if (stderr) {
          console.log(`stderr: ${stderr}`);
          return;
        }
        try {
          const gameObject = JSON.parse(stdout);
          if (gameObject.complete) {
            // This is a complete game and can be stored as one.
          } else {
            // This is incomplete and needs to be stored differently.
          }
        } catch (error) {
          console.log("Game upload failed: ", error);
        }
      }
    );
  }
};

// export const getLatestGame = () => {
//   return;
// };
