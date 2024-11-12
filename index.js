const express = require('express');
const { exec } = require('child_process');
const app = express();

let count = 0;
app.all('/', (req, res) => {
    console.log("Received a request!");
    count = count+1
    // Executa comandos para verificar a versão do ffmpeg e do yt-dlp
    res.json({
        HELLO:`Hello {count}`
    })
});

app.listen(3000, () => {
    console.log("Server is running...");
});
