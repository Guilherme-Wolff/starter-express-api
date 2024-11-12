const express = require('express');
const { exec } = require('child_process');
const app = express();

app.all('/', (req, res) => {
    console.log("Received a request!");

    // Executa comandos para verificar a versão do ffmpeg e do yt-dlp
    exec('npx ffmpeg -version', (ffmpegError, ffmpegStdout, ffmpegStderr) => {
        if (ffmpegError || ffmpegStderr) {
            console.error(`ffmpeg error: ${ffmpegError || ffmpegStderr}`);
            return res.status(500).send("Could not retrieve ffmpeg version.");
        }

        // Extrai a primeira linha da saída do ffmpeg (versão)
        const ffmpegVersion = ffmpegStdout.split('\n')[0];

        exec('npx yt-dlp --version', (ytdlpError, ytdlpStdout, ytdlpStderr) => {
            if (ytdlpError || ytdlpStderr) {
                console.error(`yt-dlp error: ${ytdlpError || ytdlpStderr}`);
                return res.status(500).send("Could not retrieve yt-dlp version.");
            }

            const ytdlpVersion = ytdlpStdout.trim();

            // Recupera o espaço em disco
            exec('df -k --output=avail /', (diskError, diskStdout, diskStderr) => {
                if (diskError || diskStderr) {
                    console.error(`Disk error: ${diskError || diskStderr}`);
                    return res.status(500).send("Could not retrieve disk usage information.");
                }

                try {
                    const availableKB = parseInt(diskStdout.trim().split('\n')[1], 10);
                    const availableGB = (availableKB / (1024 ** 2)).toFixed(2); // Convertendo KB para GB

                    // Envia as informações na resposta
                    res.json({
                        ffmpegVersion,
                        ytdlpVersion,
                        availableDiskSpace: `${availableGB} GB`
                    });
                } catch (parseError) {
                    console.error("Parse error:", parseError);
                    res.status(500).send("Error parsing disk usage information.");
                }
            });
        });
    });
});

app.listen(3000, () => {
    console.log("Server is running...");
});
