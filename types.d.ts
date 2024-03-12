interface Data{
    _id?: string;
    name: string;
    format: string;
    created: number;
    modified: number;
    data: any;
    password: string;
    roles: string[];
}

type Format = "text" | "img" | "json"

interface FileData{
    _id?: string;
    name: string;
    route: string;
    size: number;
    base64: string;
    created: number;
    password: string;
    roles: string[];
}

interface FolderData{
    _id?: string;
    name: string;
    route: string;
    created: number;
    password: string;
    roles: string[];
}

interface Role{
    _id?: string;
    name: string;
    password: string;
    permissions: string[];
}