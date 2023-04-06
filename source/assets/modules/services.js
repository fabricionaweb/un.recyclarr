const BASE_URL = "/plugins/un.recyclarr"

// Run on manual (using dynamix)
export const run = () => $.post("/webGui/include/StartCommand.php", { cmd: "recyclarr nchan" })

// Save crontab
export const save = ({ schedule, custom }) => $.post(`${BASE_URL}/Update.php`, { schedule, custom })

// Create config file
export const create = (fileName) => $.post(`${BASE_URL}/Create.php`, { fileName })

// Read config file
export const read = (fileName) => $.get(`${BASE_URL}/Open.php`, { fileName })

// Edit config file
export const edit = ({ fileName, contents }) => $.post(`${BASE_URL}/Edit.php`, { fileName, contents })

// Delete config (php doest have body for delete request)
export const del = (fileName) => $.post(`${BASE_URL}/Delete.php`, { fileName })
