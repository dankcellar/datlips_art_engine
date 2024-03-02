const os = require("os");
const spawn = require("child_process").spawn;
const WebSocket = require("ws");

module.exports = () => {
  const wss = new WebSocket.Server({ port: 42069 });

  wss.on("connection", (ws) => {
    const shellProcess = spawn(getShellPath());

    shellProcess.stdout.setEncoding("utf8");
    shellProcess.stdout.on("data", (data) => {
      const str = data.toString();
      console.log(str);
      // ws.send(str);
    });

    shellProcess.stderr.setEncoding("utf8");
    shellProcess.stderr.on("data", (data) => {
      const str = data.toString();
      console.error(str);
    });

    shellProcess.on("close", (code) => {
      console.info("closing code: " + code);
    });

    ws.on("message", (data) => {
      shellProcess.stdin.write(data + "\n");
    });

    ws.on("close", () => {
      shellProcess.kill();
    });
  });
};

function getShellPath() {
  const platform = os.platform();
  if (platform === "win32") {
    return "powershell.exe";
  } else if (platform === "darwin" || platform === "linux") {
    return "bash";
  } else {
    // Handle unsupported platform if needed
    return null;
  }
}
