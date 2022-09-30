import ResourceInfo from "./resourceInfo";

export default interface ExecInfo {
    uid: string;
    api_version: string;
    command: string;
    resource: ResourceInfo;
    value: any;
}