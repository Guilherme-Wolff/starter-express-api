const express = require('express');
const { exec } = require('child_process');
const app = express();

app.all('/', (req, res) => {
    console.log("Just got a request!");

    exec('df -k --output=avail /', (error, stdout, stderr) => {
        if (error) {
            console.error(`Exec error: ${error.message}`);
            return res.status(500).send("Could not retrieve disk usage information.");
        }
        if (stderr) {
            console.error(`Stderr: ${stderr}`);
            return res.status(500).send("Error retrieving disk usage.");
        }

        try {
            // Pega apenas a segunda linha com o valor disponível em KB
            const availableKB = parseInt(stdout.trim().split('\n')[1], 10);
            const availableGB = (availableKB / (1024 ** 2)).toFixed(2); // Convertendo KB para GB

            res.json({
                availableDiskSpace: `${availableGB} GB`
            });
        } catch (parseError) {
            console.error("Parse error:", parseError);
            res.status(500).send("Error parsing disk usage information.");
        }
    });
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running...");
});
