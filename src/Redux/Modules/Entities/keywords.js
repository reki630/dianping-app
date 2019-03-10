import createReducer from '../../../Utils/createReducer'

export const schema ={
    name:'keywords',
    id:'id'
}
const reducer = createReducer(schema.name)
export default reducer

export const getKeywordById = (state,id) => {
    return state.entities.keywords[id]
}