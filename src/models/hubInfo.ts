import ConnInfo from "./connInfo";
import ExecInfo from "./execInfo";

type SiteReturn = ExecInfo | ConnInfo;
export default interface HubInfo {
    connections: SiteReturn[];
    api_version: "1.0.1";
}