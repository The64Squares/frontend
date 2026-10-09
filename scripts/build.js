process.env.CI = "false";
const { execSync } = require("child_process");

try {
  execSync("react-scripts build", {
    stdio: "inherit",
    env: { ...process.env, CI: "false" },
  });
} catch (error) {
  process.exit(1);
}
