const express = require('express');
//const disk = require('diskusage');
//const path = require('path');
const app = express();


const state_counter = 0;
app.all('/', async (req, res) => {
    console.log("Just got a request!");

    try {
        state_counter = state_counter +1;
        // Defina o caminho para a unidade de disco. Use "/" no Linux/Mac e "C:\\" no Windows.
    

        // Crie uma resposta JSON com as informações do disco
        res.json({
            hello:`Hello ${state_counter}`,
        });
    } catch (error) {
        console.error("Error retrieving disk usage:", error);
        res.status(500).send("Could not retrieve disk usage information.");
    }
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running...");
});
