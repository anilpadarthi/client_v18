import moment from "moment";


export function cleanDate(strDateTime: string | null): string | null {
    if (strDateTime == null) {
        return null;
    }
    return moment(strDateTime)
        .local()
        .format('YYYY-MM-DD')
        .substring(0, 10);
}