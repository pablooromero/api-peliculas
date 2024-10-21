import { FilterTypeValue } from "../tables/filter.table"
import moment from "moment"

export const setValueCriteria = (value: any, type: string) => {
  switch (type) {
    case FilterTypeValue.NUMBER:
      return Number(value)
      case FilterTypeValue.BOOLEAN:
        return Boolean(value)
      case FilterTypeValue.DATE:
      return moment(new Date(value)).toDate()
    default:
      return value.toString()
  }
}

export const getInValue = (filterValue: any): string => {

  let values: string

  const parsedValues = JSON.parse(filterValue as string)
  parsedValues.forEach((el, i) => {
    values = (i == 0) ? `${el}` : `${values},${el}`
  })

  return values
}
