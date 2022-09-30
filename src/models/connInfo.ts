import SiteInfo from "./siteInfo";

export default interface ConnInfo extends SiteInfo {
    last_seen: Date;
}