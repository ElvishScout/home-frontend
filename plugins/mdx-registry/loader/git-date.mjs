// @ts-check

import cp from "node:child_process";

// Commit records start with this control character, which cannot appear in
// file names, so date lines and file-name lines are unambiguous to parse.
const RECORD_SEP = "\x01";

/**
 * Last commit date for each of the given paths, from a single `git log`
 * invocation. Files with no commit history (e.g. not yet committed) are
 * absent from the result.
 *
 * @param {string[]} paths  Repo-relative posix paths.
 * @returns {Promise<Map<string, Date>>}
 */
export function gitDates(paths) {
  return new Promise((resolve, reject) => {
    // core.quotePath=false: print non-ASCII file names as raw UTF-8 instead
    // of octal-escaped quoted strings, so they match `paths` exactly.
    const args = [
      "-c",
      "core.quotePath=false",
      "log",
      `--format=${RECORD_SEP}%aI`,
      "--name-only",
      "--",
      ...paths,
    ];

    cp.execFile("git", args, { maxBuffer: 64 * 1024 * 1024 }, (error, stdout) => {
      if (error) {
        return reject(error);
      }

      /** @type {Map<string, Date>} */
      const dates = new Map();

      let current = null;
      for (const line of stdout.split("\n")) {
        if (line.startsWith(RECORD_SEP)) {
          current = new Date(line.slice(RECORD_SEP.length).trim());
        } else if (line && current && !dates.has(line)) {
          // Log output is newest-first: the first commit that lists a file
          // is its last modification.
          dates.set(line, current);
        }
      }

      resolve(dates);
    });
  });
}
