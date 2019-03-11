import {createStore,applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import api from './Middleware/api'
import rootReducer from './Modules'

let store
if(process.env.NODE_ENV !== 'production' && window.__REDUX_DEVTOOLS_EXTENSION__) {
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    store = createStore(rootReducer,composeEnhancers(applyMiddleware(thunk,api)))
}else {
    store = createStore(rootReducer,applyMiddleware(thunk,api))//一定要将api中间件放在thunk之后，因为需要thunk为我们处理函数类型的action，然后才用api执行具体请求的封装
}


export default store