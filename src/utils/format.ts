import numeral from 'numeral'

export const formatAmount = (num: number) => numeral(num).format('0,0.00')
