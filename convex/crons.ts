import { cronJobs } from "convex/server";
import { api } from "./_generated/api";

const crons = cronJobs();

// crons.daily(
//   "Get newest Jeopardy game to archive",
//   { hourUTC: 22, minuteUTC: 0 },
//   api.games.getLatestGame
// );

export default crons;
