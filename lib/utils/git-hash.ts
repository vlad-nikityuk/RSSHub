import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

let gitHash = process.env.HEROKU_SLUG_COMMIT?.slice(0, 8) || process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 8);
let gitDate: Date | undefined;

// Check if we're in a Git repository before attempting Git operations
const isGitRepo = () => {
    try {
        // Check if .git directory exists or if we're in a git worktree
        return fs.existsSync('.git') || fs.existsSync(path.join(process.cwd(), '.git'));
    } catch {
        return false;
    }
};

if (!gitHash) {
    try {
        // Only attempt Git operations if we're in a Git repository
        if (isGitRepo()) {
            gitHash = execSync('git rev-parse HEAD').toString().trim().slice(0, 8);
            gitDate = new Date(execSync('git log -1 --format=%cd').toString().trim());
        } else {
            gitHash = 'unknown';
        }
    } catch {
        gitHash = 'unknown';
    }
}

export { gitHash, gitDate };
