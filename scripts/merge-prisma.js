const fs = require('fs');
const path = require('path');

const baseSchema = `
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
`;

const folders = ['enums', 'models'];

let content = baseSchema;

folders.forEach((folder) => {
  const dir = path.join(__dirname, '../prisma', folder);
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    content += '\n' + fs.readFileSync(filePath, 'utf-8');
  });
});

fs.writeFileSync(path.join(__dirname, '../prisma/schema.prisma'), content);
