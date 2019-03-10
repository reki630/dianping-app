import React, { Component } from 'react';
import {bindActionCreators} from 'redux'
import SearchBox from './Components/SearchBox'
import PopularSearch from './Components/PopularSearch'
import SearchHistory from './Components/SearchHistory'
import {actions as searchActions,getPopularKeywords,getRelatedKeywords,getInputText,getHistoryKeywords} from '../../Redux/Modules/search'
import { connect } from 'react-redux';

class Search extends Component {
    render() {
        const {inputText,relatedKeywords,popularKeywords,historyKeywords} = this.props
        return (
            <div>
                <SearchBox 
                    inputText={inputText} 
                    relatedKeywords={relatedKeywords} 
                    onChange={this.handleChangeInput} 
                    onClear={this.handleClearInput}
                    onCancel={this.handleCancel}
                    onClickItem={this.handleClickItem}
                />
                <PopularSearch data={popularKeywords} onClickItem={this.handleClickItem}/>
                <SearchHistory data={historyKeywords} onClickItem={this.handleClickItem} onClear={this.handleHistory}/>
            </div>
        );
    }
    componentDidMount(){
        const {loadPopularKeywords} = this.props.searchActions
        loadPopularKeywords()
    }
    handleChangeInput = text => {
        const {setInputText,loadRelatedKeywords} = this.props.searchActions
        setInputText(text)
        loadRelatedKeywords(text)
    }
    handleClearInput = () => {
        const {clearInputText} = this.props.searchActions
        clearInputText()
    }
    handleCancel = () => {
        this.handleClearInput()
        this.props.history.goBack()
    }
    handleClickItem = item => {
        const {setInputText,addHistoryKeyword,loadRelatedShops} = this.props.searchActions
        setInputText(item.keyword)
        addHistoryKeyword(item.id)
        loadRelatedShops(item.id)
        this.props.history.push('/search_result')
    }
    handleHistory = () => {
        const {clearHistoryKeywords} = this.props.searchActions
        clearHistoryKeywords()
    }
    componentWillUnmount(){
        const {clearInputText} = this.props.searchActions
        clearInputText()
    }
}
const mapStateToProps = (state,props) => {
    return {
        popularKeywords:getPopularKeywords(state),
        relatedKeywords:getRelatedKeywords(state),
        inputText:getInputText(state),
        historyKeywords:getHistoryKeywords(state)
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        searchActions:bindActionCreators(searchActions,dispatch)
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(Search)
