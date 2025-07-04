```prisma

// prisma\schema.prisma
generator client {
  provider = "prisma-client-js"
  output   = "../generated/prisma"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String   @id @default(uuid())
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  username      String   @unique
  name          String
  email         String   @unique
  password_hash String   @unique
  role          Role     @default(BASIC)
  files         File[] // user's uploaded files // One User can upload many Files
  folders       Folder[] // user's folders      // One User can create many folders
}

model File {
  id        String   @id @default(uuid())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  name      String
  path      String // File path or URL on disk/cloud
  size      Int
  mimetype  String
  user      User     @relation(fields: [userId], references: [id]) // Each File belongs to one User
  userId    String
  folder    Folder?  @relation(fields: [folderId], references: [id]) // Each File can be in one Folder, or in no folder (nullable)
  folderId  String? // Nullable for unassinged files
}

model Folder {
  id        String   @id @default(uuid())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  name      String
  user      User     @relation(fields: [userId], references: [id]) // Each Folder belongs to one User
  userId    String
  files     File[] // A Folder can contains many files
  parent    Folder?  @relation("FolderToSubfolder", fields: [parentId], references: [id]) // A folder can have an optional parent folder
  parentId  String?
  children  Folder[] @relation("FolderToSubfolder") // For nested folders  // A Folder can contain subfolders (children)
}

enum Role {
  BASIC
  ADMIN
  EDITOR
}

model Session {
  id        String   @id
  sid       String   @unique
  data      String
  expiresAt DateTime
}

// POST /upload — Upload files to a folder (or root).

// POST /folders — Create folder.

// GET /folders — List folders and their contents.

// PATCH /folders/:id — Rename folder.

// DELETE /folders/:id — Delete folder & its files (if any).

// DELETE /files/:id — Delete specific file.

```
