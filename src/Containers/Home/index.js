import React, { Component } from 'react';
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import Category from './Components/Category'
import HeadLine from './Components/HeadLine'
import Discount from './Components/Discount'
import LikeList from './Components/LikeList'
import HomeHeader from './Components/HomeHeader'
import Activity from './Components/Activity'
import Banner from '../../Components/Banner'
import Footer from '../../Components/Footer'
import {actions as homeActions,getLikes,getDiscounts,getPageCountOfLikes} from '../../Redux/Modules/home'

class Home extends Component {
    render() {
        const {likes,discounts,pageCount} = this.props
        return (
            <div>
                <HomeHeader/>
                <Banner/>
                <Category/>
                <HeadLine/>
                <Activity/>
                <Discount data={discounts}/>
                <LikeList data={likes} pageCount={pageCount} fetchData={this.fetchMoreLikes}/>
                <Footer/>
            </div>
        );
    }
    componentDidMount(){
        this.props.homeActions.loadDiscounts()
    }
    fetchMoreLikes = () => {
        this.props.homeActions.loadLikes()
    }
}

const mapStateToProps = (state,props) => {
    return {
        likes:getLikes(state),
        discounts:getDiscounts(state),
        pageCount:getPageCountOfLikes(state)
    }
}
const mapDispatchToProps = dispatch => {
    return {
        homeActions:bindActionCreators(homeActions,dispatch)
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(Home);