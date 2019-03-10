import React, { Component } from 'react';
import ErrorToast from '../../Components/ErrorToast'
import {connect} from 'react-redux'
import {BrowserRouter as Router,Route,Switch} from 'react-router-dom'
import { actions as appActions,getError } from '../../Redux/Modules/app';
import { bindActionCreators } from 'redux';
import AsyncComponent from '../../Utils/AsyncComponent'
import PrivateRouter from '../PrivateRouter'

const Home = AsyncComponent(() => import('../Home'))
const ProductDetail = AsyncComponent(() => import('../ProductDetail'))
const Search = AsyncComponent(() => import('../Search'))
const SearchResult = AsyncComponent(() => import('../SearchResult'))
const Login = AsyncComponent(() => import('../Login'))
const User = AsyncComponent(() => import('../User'))
const Purchase = AsyncComponent(() => import('../Purchase'))

class App extends Component {
    render() {
        const {error,appActions:{clearError}} = this.props
        return (
            <div className="App">
                <Router>
                    <Switch>
                        <Route path = '/login' component={Login}/>
                        <PrivateRouter path = '/user' component={User}/>
                        <Route path = '/detail/:id' component={ProductDetail}/>
                        <Route path = '/search' component={Search}/>
                        <Route path = '/search_result' component={SearchResult}/>
                        <PrivateRouter path = '/purchase/:id' component={Purchase}/>
                        <Route path = '/' component={Home}/>
                    </Switch>
                </Router>
                {error ? (<ErrorToast msg={error} clearError={clearError}/>) : null}
            </div>
          );
    }
}
const mapStateToProps = (state,props) => {
    return {
        error: getError(state)
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        appActions: bindActionCreators(appActions,dispatch)
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(App);
