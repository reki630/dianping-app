import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Header from '../../Components/Header'
import ProductOverview from './Components/ProductOvervIew'
import ShopInfo from './Components/ShopInfo'
import Detail from './Components/Detail'
import Remark from './Components/Remark'
import BuyButton from './Components/BuyButton'
import {actions as detailActions,getProduct,getRelatedShop} from '../../Redux/Modules/detail'

class ProductDetail extends Component {
    render() {
        const {product,relatedShop} = this.props
        return (
            <div>
                <Header title='团购详情' onBack={this.handleBack} gray/>
                {product && (<ProductOverview data={product}/>)}
                {relatedShop && (<ShopInfo data={relatedShop} total={product.shopIds.length}/>)}             
                {product && (<div>
                    <Detail data={product}/>
                    <Remark data={product}/>
                    <BuyButton productId={product.id}/>
                </div>)}
            </div>
        );
    }
    componentDidMount(){
        const {product} = this.props
        if(!product){
            const productId = this.props.match.params.id
            this.props.detailActions.loadProductDetail(productId)
        }else if(!this.props.relatedShop){
            this.props.detailActions.loadShopById(product.nearestShop)
        }
    }
    componentDidUpdate(preProps){
        if(!preProps.product && this.props.product){
            this.props.detailActions.loadShopById(this.props.product.nearestShop)
        }
    }
    handleBack = () => {
        this.props.history.goBack()
    }
}
const mapStateToProps = (state,props) => {
    const productId = props.match.params.id
    return{
        product:getProduct(state,productId),
        relatedShop:getRelatedShop(state,productId)
    }
}
const mapDispatchToProps = dispatch => {
    return{
        detailActions:bindActionCreators(detailActions,dispatch)
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(ProductDetail);