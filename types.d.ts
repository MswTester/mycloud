interface Data{
    _id?: string;
    name: string;
    format: string;
    created: number;
    modified: number;
    data: any;
}

type Format = "text" | "img" | "json"


interface FData{
    _id?: string;
    name: string;
    
}