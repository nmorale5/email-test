import moment from "moment";
/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
export const formatDate = (date: Date, verbose = false): string => moment(date).format(verbose ? "MMMM Do YYYY, h:mm a" : "M/D/YY");
