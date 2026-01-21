const fs = require('fs');
const axios = require('axios');

async function getHistory() {
    try {
        const res = await axios.get('http://localhost:3000/signals');
        console.log("Saving history to history_dump.json...");
        fs.writeFileSync('history_dump.json', JSON.stringify(res.data, null, 2));
        console.log("Done.");
    } catch (e) {
        console.error(e.message);
    }
}

getHistory();
