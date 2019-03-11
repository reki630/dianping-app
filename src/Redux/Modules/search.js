import url from '../../Utils/url'
import {FETCH_DATA} from '../Middleware/api'
import {schema as keywordSchema,getKeywordById} from './Entities/keywords'
import {schema as shopSchema,getShopById} from './Entities/shops'
import { combineReducers } from 'redux'

export const types ={
    FETCH_POPULAR_KEYWORDS_REQUEST:'SEARCH/FETCH_POPULAR_KEYWORDS_REQUEST',
    FETCH_POPULAR_KEYWORDS_SUCCESS:'SEARCH/FETCH_POPULAR_KEYWORDS_SUCCESS',
    FETCH_POPULAR_KEYWORDS_FAILURE:'SEARCH/FETCH_POPULAR_KEYWORDS_FAILURE',
    FETCH_RELATED_KEYWORDS_REQUEST:'SEARCH/FETCH_RELATED_KEYWORDS_REQUEST',
    FETCH_RELATED_KEYWORDS_SUCCESS:'SEARCH/FETCH_RELATED_KEYWORDS_SUCCESS',
    FETCH_RELATED_KEYWORDS_FAILURE:'SEARCH/FETCH_RELATED_KEYWORDS_FAILURE',
    SET_INPUT_TEXT:'SEARCH/SET_INPUT_TEXT',
    CLEAR_INPUT_TEXT:'SEARCH/CLEAR_INPUT_TEXT',
    ADD_HISTORY_KEYWORD:'SEARCH/ADD_HISTORY_KEYWORD',
    CLEAR_HISTORY_KEYWORDS:'SEARCH/CLEAR_HISTORY_KEYWORDS',
    FETCH_SHOPS_REQUEST:'SEARCH/FETCH_SHOPS_REQUEST',
    FETCH_SHOPS_SUCCESS:'SEARCH/FETCH_SHOPS_SUCCESS',
    FETCH_SHOPS_FAILURE:'SEARCH/FETCH_SHOPS_FAILURE',
}
const initialState = {
    inputText:'',
    popularKeywords:{
        isFetching:false,
        ids:[]
    },
    relatedKeywords:{
        /**
            * relatedKeywords对象结构：
            * {
            *   '火锅': {
            *       isFetching: false,
            *       ids: []
            *    }
            * }
        */
    },
    historyKeywords:[],
    searchedShopsByKeyword:{
        /**
            * searchedShopsByKeywords对象结构：
            * {
            *   keywordId: {
            *       isFetching: false,
            *       ids: []
            *    }
            * }
        */
    }
}
export const actions = {
    loadPopularKeywords: () => {
        return (dispatch,getState) => {
            const {ids} = getState().search.popularKeywords
            if(ids.length>0){
                return null
            }
            const endpoint = url.getPopularKeywords()
            return dispatch(fetchPopularKeywords(endpoint))
        }
    },
    loadRelatedKeywords: text => {
        return (dispatch,getState) => {
            const {relatedKeywords} = getState().search
            if(relatedKeywords[text]){
                return null
            }
            const endpoint = url.getRelatedKeywords(text)
            return dispatch(fetchRelatedKeywords(text,endpoint))
        }
    },
    setInputText: text => ({
        type:types.SET_INPUT_TEXT,
        text
    }),
    clearInputText: () => ({
        type:types.CLEAR_INPUT_TEXT
    }),
    addHistoryKeyword: keywordId => ({
        type:types.ADD_HISTORY_KEYWORD,
        text:keywordId
    }),
    clearHistoryKeywords: () => ({
        type:types.CLEAR_HISTORY_KEYWORDS
    }),
    loadRelatedShops:keyword => {
        return (dispatch,getState) => {
            const {searchedShopsByKeyword} = getState().search
            if(searchedShopsByKeyword[keyword]){
                return null
            }
            const endpoint = url.getRelatedShops(keyword)
            return dispatch(fetchRelatedShops(keyword,endpoint))
        }
    }
}
const fetchPopularKeywords = endpoint => ({
    [FETCH_DATA]:{
        types:[
            types.FETCH_POPULAR_KEYWORDS_REQUEST,
            types.FETCH_POPULAR_KEYWORDS_SUCCESS,
            types.FETCH_POPULAR_KEYWORDS_FAILURE
        ],
        endpoint,
        schema:keywordSchema
    }
})
const fetchRelatedKeywords = (text,endpoint) => ({
    [FETCH_DATA]:{
        types:[
            types.FETCH_RELATED_KEYWORDS_REQUEST,
            types.FETCH_RELATED_KEYWORDS_SUCCESS,
            types.FETCH_RELATED_KEYWORDS_FAILURE
        ],
        endpoint,
        schema:keywordSchema
    },
    text
})
const fetchRelatedShops = (text,endpoint) => ({
    [FETCH_DATA]:{
        types:[
            types.FETCH_SHOPS_REQUEST,
            types.FETCH_SHOPS_SUCCESS,
            types.FETCH_SHOPS_FAILURE
        ],
        endpoint,
        schema:shopSchema
    },
    text
})
const popularKeywords = (state = initialState.popularKeywords,action) => {
    switch(action.type) {
        case types.FETCH_POPULAR_KEYWORDS_REQUEST:
            return {...state,isFetching:true}
        case types.FETCH_POPULAR_KEYWORDS_SUCCESS:
            return {...state,isFetching:false,ids:state.ids.concat(action.response.ids)}
        case types.FETCH_POPULAR_KEYWORDS_FAILURE:
            return {...state,isFetching:false}
        default:  
            return state
    }
}
const relatedKeywords = (state = initialState.relatedKeywords,action) => {
    switch(action.type){
        case types.FETCH_RELATED_KEYWORDS_REQUEST:
        case types.FETCH_RELATED_KEYWORDS_SUCCESS:
        case types.FETCH_RELATED_KEYWORDS_FAILURE:
            return {
                ...state,
                [action.text]: relatedKeywordsById(state[action.text],action)
            }
        default:
            return state
    }
}
const relatedKeywordsById = (state = {isFetching:false,ids:[]},action) => {
    switch(action.type){
        case types.FETCH_RELATED_KEYWORDS_REQUEST:
            return {...state,isFetching:true}
        case types.FETCH_RELATED_KEYWORDS_SUCCESS:
            return {...state,isFetching:false,ids:state.ids.concat(action.response.ids)}
        case types.FETCH_RELATED_KEYWORDS_FAILURE:
            return {...state,isFetching:false}
        default:
            return state
    }
}
const inputText = (state = initialState.inputText,action) => {
    switch(action.type) {
        case types.SET_INPUT_TEXT:
            return action.text
        case types.CLEAR_INPUT_TEXT:
            return ''
        default:
            return state
    }
}
const historyKeywords = (state = initialState.historyKeywords,action) => {
    switch(action.type) {
        case types.ADD_HISTORY_KEYWORD:
            const data = state.filter(item => {
                if(item !== action.text){
                    return true
                }
                return false
            })
            return [action.text,...data]
        case types.CLEAR_HISTORY_KEYWORDS:
            return []
        default:
            return state
    }
}
const searchedShopsByKeyword = (state = initialState.searchedShopsByKeyword,action) => {
    switch(action.type){
        case types.FETCH_SHOPS_REQUEST:
        case types.FETCH_SHOPS_SUCCESS:
        case types.FETCH_SHOPS_FAILURE:
            return {
                ...state,
                [action.text]: searchedShops(state[action.text],action)
            }
        default:
            return state
    }
}
const searchedShops = (state = {isFetching:false,ids:[]},action) => {
    switch(action.type){
        case types.FETCH_SHOPS_REQUEST:
            return {...state,isFetching:true}
        case types.FETCH_SHOPS_SUCCESS:
            return {...state,isFetching:false,ids:action.response.ids}
        case types.FETCH_SHOPS_FAILURE:
            return {...state,isFetching:false}
        default:
            return state
    }
}

const reducer = combineReducers({
    popularKeywords,relatedKeywords,inputText,historyKeywords,searchedShopsByKeyword
})
export default reducer

export const getPopularKeywords = state => {
    return state.search.popularKeywords.ids.map(id => {
        return getKeywordById(state,id)
    })
}
export const getRelatedKeywords = state => {
    const text = state.search.inputText
    if(!text || text.trim().length === 0){
        return []
    }
    const relatedKeywords = state.search.relatedKeywords[text]
    if(!relatedKeywords){
        return []
    }
    return relatedKeywords.ids.map(id => {
        return getKeywordById(state,id)
    })
}
export const getInputText = state => {
    return state.search.inputText
}
export const getHistoryKeywords = state => {
    return state.search.historyKeywords.map(id => {
        return getKeywordById(state,id)
    })
}
export const getSearchedShops = state => {
    const keywordId = state.search.historyKeywords[0]
    if(!keywordId){
        return []
    }
    const shops = state.search.searchedShopsByKeyword[keywordId]
    return shops.ids.map(id => {
        return getShopById(state,id)
    })
}
export const getCurrentKeyword = state => {
    const keywordId = state.search.historyKeywords[0]
    if(!keywordId){
        return ''
    }
    return getKeywordById(state,keywordId).keyword
}