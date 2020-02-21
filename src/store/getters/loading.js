export const loading = state => state.loading
export const loadingNum = (state) => loading(state).requestNum
export const isLoading = state => loadingNum(state) > 0
