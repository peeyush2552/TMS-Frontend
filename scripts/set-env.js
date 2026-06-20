const fs = require('fs');
const path = require('path');

// Get API URL from Vercel environment variable or use default
const apiUrl = process.env.API_URL || 'https://your-backend-url.vercel.app/api';

// Create environment.production.ts content
const envConfigFile = `export const environment = {
  production: true,
  apiUrl: '${apiUrl}',
};
`;

// Path to environment file
const targetPath = path.join(__dirname, '../src/environments/environment.production.ts');

// Write the file
fs.writeFileSync(targetPath, envConfigFile);

console.log(`✅ Environment file generated at: ${targetPath}`);
console.log(`✅ API URL: ${apiUrl}`);
