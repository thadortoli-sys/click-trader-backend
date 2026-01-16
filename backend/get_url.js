const http = require('http');

http.get('http://127.0.0.1:4040/api/tunnels', (resp) => {
    let data = '';
    resp.on('data', (chunk) => { data += chunk; });
    resp.on('end', () => {
        try {
            const json = JSON.parse(data);
            if (json.tunnels && json.tunnels.length > 0) {
                console.log(">>> URL FOUND <<<");
                console.log(json.tunnels[0].public_url);
                console.log(">>> END URL <<<");
            } else {
                console.log("NO TUNNELS FOUND");
            }
        } catch (e) { console.error(e); }
    });
}).on("error", (err) => {
    console.log("Error: " + err.message);
});
