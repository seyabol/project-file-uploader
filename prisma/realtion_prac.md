
---

## 🔄 Overview of Relationships

### 1. **User ↔ File** (One-to-Many)

* **One User** can upload **many Files**.
* Each File **belongs to one User**.

```prisma
model User {
  files File[]
}

model File {
  user   User   @relation(fields: [userId], references: [id])
  userId String
}
```

➡️ **Usage**: Fetch all files uploaded by a specific user.

---

### 2. **User ↔ Folder** (One-to-Many)

* **One User** can create **many Folders**.
* Each Folder **belongs to one User**.

```prisma
model User {
  folders Folder[]
}

model Folder {
  user   User   @relation(fields: [userId], references: [id])
  userId String
}
```

➡️ **Usage**: Each user manages their own folders.

---

### 3. **Folder ↔ File** (One-to-Many, Optional)

* A **Folder** can contain **many Files**.
* Each File can be **in one Folder**, or in **no folder** (nullable).

```prisma
model Folder {
  files File[]
}

model File {
  folder   Folder? @relation(fields: [folderId], references: [id])
  folderId String?
}
```

➡️ **Usage**: Files can either be stored in a folder or in the root directory.

---

### 4. **Folder ↔ Folder (Parent-Child)** (Self-Relation)

* A **Folder** can contain **subfolders** (children).
* A **Folder** can have an **optional parent folder**.

```prisma
model Folder {
  parent   Folder?  @relation("FolderToSubfolder", fields: [parentId], references: [id])
  parentId String?
  children Folder[] @relation("FolderToSubfolder")
}
```

➡️ **Usage**: Allows **nested folders**, like:

```
Documents/
  ├── Projects/
  │     ├── 2024/
  └── Personal/
```

---

## 🔗 Summary Table

| Model    | Related Model | Type               | Description                                  |
| -------- | ------------- | ------------------ | -------------------------------------------- |
| `User`   | `File[]`      | 1-to-Many          | A user can upload many files                 |
| `User`   | `Folder[]`    | 1-to-Many          | A user can create many folders               |
| `Folder` | `File[]`      | 1-to-Many          | A folder can hold many files                 |
| `File`   | `Folder?`     | Optional Many-to-1 | A file may belong to a folder                |
| `Folder` | `Folder?`     | Self-Relation      | A folder can have a parent folder            |
| `Folder` | `Folder[]`    | Self-Relation      | A folder can have many subfolders (children) |

---

