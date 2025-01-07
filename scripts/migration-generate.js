/* eslint-disable @typescript-eslint/no-require-imports */
const { execSync } = require('child_process');

const args = process.argv.slice(2);

if (!args.length) {
  console.error('Error: Migration name is required.');
  process.exit(1);
}

const migrationName = args[0];
const migrationPath = `./src/persistance/migrations/${migrationName}`;

try {
  execSync(`yarn datasource migration:generate ${migrationPath}`, {
    stdio: 'inherit',
  });
} catch (error) {
  console.error('Error generating migration:', error.message);
  process.exit(1);
}
