import createReducer from '../../../Utils/createReducer'

export const schema ={
    name:'shops',
    id:'id'
}
const reducer = createReducer(schema.name)
export default reducer
export const getShopById = (state,id) =>{
    const shop = state.entities.shops[id]
    return shop
}