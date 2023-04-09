type TagItem = {
    key: string;
    value: string;
};
type TagDesc = {
    tags: TagItem[];
    description: string;
};
declare function readTagDesc(fileName: string): TagDesc;
export { readTagDesc };
