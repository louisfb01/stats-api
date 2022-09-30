/**
 * Meta-data on a FHIR resource
 */
export default class ResourceInfo {
    type: string;
    attribute: string;
    begin_date: Date;
    end_date: Date;
    datatype: string;

    constructor(type: string, attr: string, beg: Date, end: Date, dtype: string) {
        this.type = type;
        this.attribute = attr;
        this.begin_date = beg;
        this.end_date = end;
        this.datatype = dtype;
    }
}