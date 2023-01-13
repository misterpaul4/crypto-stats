import moment from "moment";
import { dateFormat } from ".";

export const displayData = (data) => {
  if (moment.isMoment(data)) {
    return dateFormat(data.toISOString());
  }
  return data.toString();
};
