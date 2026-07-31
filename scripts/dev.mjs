import { spawn } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const rootDirectory = join(dirname(fileURLToPath(import.meta.url)), "..");
const serviceConfigs = [
  {
    name: "frontend",
    directory: join(rootDirectory, "frontend"),
    command: ["start"],
    port: "3011",
  },
  {
    name: "backend",
    directory: join(rootDirectory, "backend"),
    command: ["run", "dev"],
    port: "3012",
  },
];

console.log("Frontend: http://localhost:3011");
console.log("Backend:  http://localhost:3012");

const children = serviceConfigs.map((service) => ({
  service,
  process: spawn("npm", service.command, {
    cwd: service.directory,
    detached: process.platform !== "win32",
    env: { ...process.env, PORT: service.port },
    stdio: "inherit",
  }),
}));

let stopping = false;
let remainingChildren = children.length;
let finalExitCode = 0;

const killChild = (child, signal) => {
  if (child.exitCode !== null || child.killed) return;

  try {
    if (process.platform === "win32") child.kill(signal);
    else process.kill(-child.pid, signal);
  } catch {
    child.kill(signal);
  }
};

const stop = (signal, exitCode) => {
  if (stopping) return;

  stopping = true;
  finalExitCode = exitCode;
  children.forEach(({ process: child }) => killChild(child, signal));
};

children.forEach(({ service, process: child }) => {
  child.on("error", (error) => {
    console.error(`Failed to start ${service.name}:`, error);
    stop("SIGTERM", 1);
  });

  child.on("exit", (code, signal) => {
    remainingChildren -= 1;

    if (!stopping) {
      console.error(
        `${service.name} stopped unexpectedly (${signal ?? `exit ${code}`})`
      );
      stop("SIGTERM", code ?? 1);
    }

    if (remainingChildren === 0) process.exit(finalExitCode);
  });
});

process.on("SIGINT", () => stop("SIGINT", 0));
process.on("SIGTERM", () => stop("SIGTERM", 0));
