import url from '../../Utils/url'
import { combineReducers } from 'redux'
import {createSelector} from 'reselect'
import { FETCH_DATA } from '../Middleware/api'
import {schema,TO_PAY_TYPE,AVAILABLE_TYPE,REFUND_TYPE,getAllOrders,actions as orderActions,types as orderTypes} from './Entities/orders'
import {actions as commentActions} from './Entities/comments'

const typeToKey = {
    [TO_PAY_TYPE]:'toPayIds',
    [AVAILABLE_TYPE]:'availableIds',
    [REFUND_TYPE]:'refundIds'
}
const initialState = {
    orders:{
        isFetching:false,
        fetched:false,
        ids:[],
        toPayIds:[],//待付款
        availableIds:[],//可使用
        refundIds:[]//已退款
    },
    currentTab:0,
    currentOrder:{
        id:null,
        isDeleting:false,
        isCommenting:false,
        comment:'',
        stars:0
    }
}
export const types ={
    FETCH_ORDERS_REQUEST:'USER/FETCH_ORDERS_REQUEST',
    FETCH_ORDERS_SUCCESS:'USER/FETCH_ORDERS_SUCCESS',
    FETCH_ORDERS_FAILURE:'USER/FETCH_ORDERS_FAILURE',
    SET_CURRENT_Tab:'USER/SET_CURRENT_Tab',
    DELETE_ORDER_REQUEST:'USER/DELETE_ORDER_REQUEST',
    DELETE_ORDER_SUCCESS:'USER/DELETE_ORDER_SUCCESS',
    DELETE_ORDER_FAILURE:'USER/DELETE_ORDER_FAILURE',
    SHOW_DELETE_DIALOG:'USER/SHOW_DELETE_DIALOG',
    HIDE_DELETE_DIALOG:'USER/HIDE_DELETE_DIALOG',
    SHOW_COMMENT_AREA:'USER/SHOW_COMMENT_AREA',
    HIDE_COMMENT_AREA:'USER/HIDE_COMMENT_AREA',
    SET_COMMENT:'USER/SET_COMMENT',
    SET_STARS:'USER/SET_STARS',
    POST_COMMENT_REQUEST:'USER/POST_COMMENT_REQUEST',
    POST_COMMENT_SUCCESS:'USER/POST_COMMENT_SUCCESS',
    POST_COMMENT_FAILURE:'USER/POST_COMMENT_FAILURE'
}
export const actions={
    loadOrders: () => {
        return (dispatch,getState) => {
            const {ids,fetched} = getState().user.orders
            if(fetched){
                return null
            }
            const endpoint = url.getOrders()
            return dispatch(fetchOrders(endpoint))
        }
    },
    setCurrentTab:index => ({
        type:types.SET_CURRENT_Tab,
        index
    }),
    removeOrder:() => {
        return (dispatch,getState) => {
            const {id} = getState().user.currentOrder
            if(id){
                dispatch(deleteOrderRequest())
                return new Promise((resolve,reject) => {
                    setTimeout(() => {
                        dispatch(deleteOrderSuccess(id))
                        dispatch(orderActions.deleteOrder(id))
                        resolve()
                    },500)//纯前端项目，为了模拟网络延时而使用定时器
                })
            }
        }
    },
    showDeleteDialog:orderId => ({
        type:types.SHOW_DELETE_DIALOG,
        orderId
    }),
    hideDeleteDialog:() => ({
        type:types.HIDE_DELETE_DIALOG
    }),
    showCommentArea:orderId => ({
        type:types.SHOW_COMMENT_AREA,
        orderId
    }),
    hideCommentArea:() => ({
        type:types.HIDE_COMMENT_AREA
    }),
    setComment:comment => ({
        type:types.SET_COMMENT,
        comment
    }),
    setStars:stars => ({
        type:types.SET_STARS,
        stars
    }),
    submitComment:() => {
        return(dispatch,getState) => {
            dispatch(postCommentRequest())
            return new Promise((resolve,reject) => {
                setTimeout(() => {
                    const {currentOrder:{id,stars,comment}} = getState().user
                    const commentObj = {
                        id: +new Date(),//通过时间字符串来模拟后台生成的id信息
                        stars:stars,
                        content:comment
                    }
                    dispatch(postCommentSuccess())
                    dispatch(commentActions.addComment(commentObj))
                    dispatch(orderActions.addComment(id,commentObj.id))
                    resolve()
                })
            })
        }
    }
}
const deleteOrderRequest = () => ({
    type:types.DELETE_ORDER_REQUEST
})
const deleteOrderSuccess = (orderId) => ({
    type:types.DELETE_ORDER_SUCCESS,
    orderId
})
const fetchOrders = endpoint => ({
    [FETCH_DATA]:{
        types:[
        types.FETCH_ORDERS_REQUEST,
        types.FETCH_ORDERS_SUCCESS,
        types.FETCH_ORDERS_FAILURE
        ],
        endpoint,
        schema
    }
})
const postCommentRequest = () => ({
    type:types.POST_COMMENT_REQUEST
})
const postCommentSuccess = () => ({
    type:types.POST_COMMENT_SUCCESS
})
const orders = (state = initialState.orders,action) => {
    switch(action.type){
        case types.FETCH_ORDERS_REQUEST:
            return{
                ...state,
                isFetching:true
            }
        case types.FETCH_ORDERS_SUCCESS:
            const toPayIds = action.response.ids.filter(
                id => action.response.orders[id].type === TO_PAY_TYPE
            )
            const availableIds = action.response.ids.filter(
                id => action.response.orders[id].type === AVAILABLE_TYPE
            )
            const refundIds = action.response.ids.filter(
                id => action.response.orders[id].type === REFUND_TYPE
            )
            return {
                ...state,
                isFetching:false,
                fetched:true,
                ids:state.ids.concat(action.response.ids),
                toPayIds:state.toPayIds.concat(toPayIds),
                availableIds:state.availableIds.concat(availableIds),
                refundIds:state.refundIds.concat(refundIds)
            }
        case orderTypes.DELETE_ORDER:
            return {
                ...state,
                ids:removeOrderId(state,'ids',action.orderId),
                toPayIds:removeOrderId(state,'toPayIds',action.toPayIds),
                availableIds:removeOrderId(state,'availableIds',action.availableIds),
                refundIds:removeOrderId(state,'refundIds',action.refundIds)
            }
        case types.DELETE_ORDER_SUCCESS:
            return {
                ...state,
                ids:removeOrderId(state,'ids',action.orderId),
                toPayIds:removeOrderId(state,'toPayIds',action.toPayIds),
                availableIds:removeOrderId(state,'availableIds',action.availableIds),
                refundIds:removeOrderId(state,'refundIds',action.refundIds)
            }
        case orderTypes.ADD_ORDER:
            const {order} = action
            const key = typeToKey[order.type]
            return key ? {
                ...state,
                ids:[order.id].concat(state.ids),
                [key]:[order.id].concat(state[key])
            } : {...state,ids:[order.id].concat(state.ids)}
        case types.FETCH_ORDERS_FAILURE:
            return{...state,isFetching:false}
        default:
            return state
    }
}
const removeOrderId = (state,key,orderId) => {
    return state[key].filter(id => {
        return id !== orderId
    })
}
const currentTab = (state=initialState.currentTab,action) => {
    switch(action.type){
        case types.SET_CURRENT_Tab:
            return action.index
        default:
            return state
    }
}
const currentOrder = (state=initialState.currentOrder,action) => {
    switch(action.type){
        case types.SHOW_DELETE_DIALOG:
            return{
                ...state,
                id:action.orderId,
                isDeleting:true
            }
        case types.HIDE_DELETE_DIALOG:
            return initialState.currentOrder
        case types.DELETE_ORDER_SUCCESS:
            return initialState.currentOrder
        case types.DELETE_ORDER_FAILURE:
            return initialState.currentOrder
        case types.SHOW_COMMENT_AREA:
            return {
                ...state,
                id:action.orderId,
                isCommenting:true
            }
        case types.SET_COMMENT:
            return {
                ...state,
                comment:action.comment
            }
        case types.SET_STARS:
            return {
                ...state,
                stars:action.stars
            }
        case types.HIDE_COMMENT_AREA:
            return initialState.currentOrder
        case types.POST_COMMENT_SUCCESS:
            return initialState.currentOrder
        case types.POST_COMMENT_FAILURE:
            return initialState.currentOrder
        default:
            return state
    }
}
const reducer = combineReducers({orders,currentTab,currentOrder})
export default reducer

export const getCurrentTab = state => state.user.currentTab
const getUserOrders = state => state.user.orders
export const getOrders = createSelector([getCurrentTab,getUserOrders,getAllOrders],(tabIndex,userOrders,orders) => {
    const key = ['ids','toPayIds','availableIds','refundIds'][tabIndex]
    const orderIds = userOrders[key]
    return orderIds.map((id) => {
        return orders[id]
    })
})
export const getDeletingOrderId = (state) => {
    return state.user.currentOrder && state.user.currentOrder.isDeleting ? state.user.currentOrder.id : null
}
export const getCommentingOrderId = (state) => {
    return state.user.currentOrder && state.user.currentOrder.isCommenting ? state.user.currentOrder.id : null
}
export const getCurrentOrderComment = state => {
    return state.user.currentOrder ? state.user.currentOrder.comment : ''
}
export const getCurrentOrderStars = state => {
    return state.user.currentOrder ? state.user.currentOrder.stars : 0
}