// @ts-check

import cp from "node:child_process";

// Commit records start with this control character, which cannot appear in
// file names, so date lines and file-name lines are unambiguous to parse.
const RECORD_SEP = "\x01";

// Windows rejects a spawned process whose command line exceeds 32767
// characters (spawn ENAMETOOLONG), so the path list is split into batches that
// stay well below that. `git log` covers the full history in every batch, so
// each batch still yields the exact last-modification date of its paths.
const ARG_BUDGET = 16 * 1024;

/**
 * @param {string[]} paths
 * @returns {string[][]}
 */
function batches(paths) {
  /** @type {string[][]} */
  const out = [];
  /** @type {string[]} */
  let current = [];
  let size = 0;

  for (const path of paths) {
    // Account for the separating space and the quotes execFile adds.
    const cost = path.length + 3;
    if (current.length > 0 && size + cost > ARG_BUDGET) {
      out.push(current);
      current = [];
      size = 0;
    }
    current.push(path);
    size += cost;
  }
  if (current.length > 0) out.push(current);

  return out;
}

/**
 * Last commit date for each path in one `git log` invocation.
 *
 * @param {string[]} paths  Repo-relative posix paths.
 * @returns {Promise<Map<string, Date>>}
 */
function logDates(paths) {
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

  return new Promise((resolve, reject) => {
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

/**
 * Last commit date for each of the given paths. Files with no commit history
 * (e.g. not yet committed) are absent from the result.
 *
 * @param {string[]} paths  Repo-relative posix paths.
 * @returns {Promise<Map<string, Date>>}
 */
export async function gitDates(paths) {
  const dates = new Map();

  for (const batch of batches(paths)) {
    for (const [path, date] of await logDates(batch)) {
      dates.set(path, date);
    }
  }

  return dates;
}
