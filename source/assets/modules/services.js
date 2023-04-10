const BASE_URL = "/plugins/un.recyclarr"
const ENDPOINT = `${BASE_URL}/Actions.php`

// Get current version from cli
export const getVersion = () =>
  $.post("/webGui/include/StartCommand.php", {
    cmd: "recyclarr version",
    start: 2, // Run and return output
  })

// Run on manual (using dynamix)
export const runManual = () =>
  $.post("/webGui/include/StartCommand.php", {
    cmd: "recyclarr nchan",
    start: 1, // Run new instance and return pid
  })

// Save schedule crontab
export const updateCron = ({ schedule, custom }) =>
  $.post(ENDPOINT, { action: "update-cron", schedule, custom })

// Create config file
export const createConfig = (fileName) =>
  $.post(ENDPOINT, { action: "create-config", fileName })

// Read config file
export const viewConfig = (fileName) =>
  $.get(ENDPOINT, { action: "view-config", fileName })

// Edit config file
export const updateConfig = ({ fileName, contents }) =>
  $.post(ENDPOINT, { action: "update-config", fileName, contents })

// Delete config (php doest have body for delete request)
export const deleteConfig = (fileName) =>
  $.post(ENDPOINT, { action: "delete-config", fileName })
