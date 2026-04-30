export type FileType = "PDF" | "Image" | "Document";

export type FileCategory = "Reports" | "Residents" | "Finance" | "Cases" | "Governance";

export type AccessLevel = "Admin" | "User";

export type FileItem = {
  id: string;
  kind: "file";
  name: string;
  fileType: FileType;
  sizeMb: number;
  uploadedAt: string;
  uploadedBy: string;
  category: FileCategory;
  folderPath: string[];
  shared: boolean;
  accessLevel: AccessLevel;
};

export type FolderItem = {
  id: string;
  kind: "folder";
  name: string;
  fileCount: number;
  createdAt: string;
  folderPath: string[];
  accessLevel: AccessLevel;
};

export type FileManagerItem = FileItem | FolderItem;
