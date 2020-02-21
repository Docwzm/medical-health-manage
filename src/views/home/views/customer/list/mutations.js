import {
  CUSTOMER_LIST,
  CUSTOMER_LIST_QUERYPARAMS
} from '../../../../../store/mutation-types'
export const MUTATION_NAME = 'views-customer-list'

export default {
  [MUTATION_NAME]: {
    state: {
      list: {},
      queryParams: {
        pageNum: 1,
        pageSize: 20,
        total: 0,
      },
    },
    mutations: {
      [CUSTOMER_LIST] (state, list) {
        state.queryParams.total = list.total
        state.list = {
          ...state.list,
          ...list
        }
      },
      [CUSTOMER_LIST_QUERYPARAMS] (state, queryParams) {
        state.queryParams = {
          ...state.queryParams,
          ...queryParams
        }
      }
    }
  }
}
