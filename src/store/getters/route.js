export const route = state => state.route

export const pathGetter = state => route(state).path
export const queryGetter = state => route(state).query
export const paramsGetter = state => route(state).params
