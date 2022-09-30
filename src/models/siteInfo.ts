import ResourceInfo from "./resourceInfo";

interface Dictionary<T> {
    [Key: string]: T;
}

export default interface SiteInfo {
    uid: string;
    name: string;
    names: Dictionary<string>;
    api_version: string;
    resources: ResourceInfo[];
}