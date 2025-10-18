const fs = require('fs');
const path = require('path');
require('dotenv').config();

function updateEnvironmentFile(filePath) {
    // Lee el archivo de environment
    const envFile = fs.readFileSync(filePath, 'utf8');

    const envConfigFile = envFile.replace('${JWT_SECRET_KEY}', process.env.JWT_SECRET_KEY || '');

    fs.writeFileSync(filePath, envConfigFile, 'utf8');

    console.log(`Environment file ${filePath} updated successfully`);
}

// Actualiza tanto el environment de desarrollo y producción
updateEnvironmentFile('./src/environments/environment.ts');
updateEnvironmentFile('./src/environments/environment.prod.ts');