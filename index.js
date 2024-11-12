const express = require('express');
const { spawn } = require('child_process');
const app = express();

app.all('/', async (req, res) => {
    console.log("Received a request!");

    // Função para obter a versão do ffmpeg, yt-dlp ou curl
    const getVersion = (command, args) => {
        return new Promise((resolve, reject) => {
            const sp = spawn(command, args);

            let output = '';

            // Captura a saída do comando
            sp.stdout.on('data', (data) => {
                output += data.toString();
            });

            // Captura erros do comando
            sp.stderr.on('data', (data) => {
                console.error(`stderr: ${data}`);
            });

            // Quando o processo terminar
            sp.on('close', (code) => {
                if (code === 0) {
                    resolve(output);  // Resolve com a saída do comando
                } else {
                    reject(`Error executing ${command}`);  // Reject com a mensagem de erro
                }
            });
        });
    };

    try {
        // Executa todos os comandos assíncronos
        const ffmpegVersion = await getVersion('ffmpeg', ['-version']);
        const ytDlpVersion = await getVersion('yt-dlp', ['--version']);
        const curlVersion = await getVersion('curl', ['--version']);

        // Envia a resposta com as versões dos pacotes
        res.send({
            ffmpeg_version: ffmpegVersion,
            yt_dlp_version: ytDlpVersion,
            curl_version: curlVersion
        });
    } catch (error) {
        // Caso algum comando falhe
        res.status(500).send({ error: error });
    }
});

app.listen(process.env.PORT || 3002, () => {
    console.log("Server is running...");
});
