import 'dotenv/config';
type mediaFile = {
    name: string;
    ext: string | null;
    fileDate: Date;
    size: number;
};
export declare function importFiles(): Promise<lwLib.Catalog>;
export declare function searchFiles(folderName: string, recursive?: boolean, extensions?: string[]): Promise<{
    [key: string]: mediaFile[];
}>;
export {};
