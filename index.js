const express = require('express');
const disk = require('diskusage');
const path = require('path');
const app = express();

app.all('/', async (req, res) => {
    console.log("Just got a request!");

    try {
        // Defina o caminho para a unidade de disco. Use "/" no Linux/Mac e "C:\\" no Windows.
        const diskPath = process.platform === 'win32' ? 'C:\\' : '/';

        // Obtenha o uso do disco
        const { available, free, total } = await disk.check(diskPath);

        // Converta os valores para GB para facilitar a leitura
        const totalGB = (total / (1024 ** 3)).toFixed(2);
        const freeGB = (free / (1024 ** 3)).toFixed(2);
        const availableGB = (available / (1024 ** 3)).toFixed(2);

        // Crie uma resposta JSON com as informações do disco
        res.json({
            totalDiskSpace: `${totalGB} GB`,
            freeDiskSpace: `${freeGB} GB`,
            availableDiskSpace: `${availableGB} GB`
        });
    } catch (error) {
        console.error("Error retrieving disk usage:", error);
        res.status(500).send("Could not retrieve disk usage information.");
    }
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running...");
});
