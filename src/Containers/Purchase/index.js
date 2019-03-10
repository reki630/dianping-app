import React, { Component } from 'react';
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import PurchaseForm from './Components/PurchaseForm'
import Header from '../../Components/Header'
import Tip from '../../Components/Tip'
import {actions as purchaseActions,getQuantity,getTipStatus,getProduct,getTotalPrice} from '../../Redux/Modules/purchase'
import {actions as detailActions} from '../../Redux/Modules/detail'
import {getUsername} from '../../Redux/Modules/login'

class Purchase extends Component {
    render() {
        const {product,phone,quantity,showTip,totalPrice} = this.props
        return (
            <div>
                <Header title='下单' onBack={this.handleBack}/>
                {product ? 
                    (<PurchaseForm 
                        product={product} 
                        phone={phone} 
                        quantity={quantity} 
                        totalPrice={totalPrice}
                        onSubmit={this.handleSubmit}
                        onSetQuantity={this.handleSetQuantiy}
                    />) 
                : null}
                {showTip ? (<Tip message='购买成功' onClose={this.handleCloseTip}/>) : null}
            </div>
        );
    }
    componentDidMount(){
        const {product} = this.props
        if(!product){
            const productId = this.props.match.params.id
            this.props.detailActions.loadProductDetail(productId)
        }
    }
    componentWillUnmount(){
        this.props.purchaseActions.setOrderQuantity(1)
    }
    handleBack = () => {
        this.props.history.goBack()
    }
    handleCloseTip = () => {
        this.props.purchaseActions.closeTip()
    }
    handleSubmit = () => {
        const productId = this.props.match.params.id
        this.props.purchaseActions.submitOrder(productId)
    }
    handleSetQuantiy = (quantity) => {
        this.props.purchaseActions.setOrderQuantity(quantity)
    }
}
const mapStateToProps = (state,props) => {
    const productId = props.match.params.id
    return {
        product:getProduct(state,productId),
        quantity:getQuantity(state),
        showTip:getTipStatus(state),
        phone:getUsername(state),
        totalPrice:getTotalPrice(state,productId)
    }
}
const mapDispatchToProps = (dispatch) => {
    return{
        purchaseActions:bindActionCreators(purchaseActions,dispatch),
        detailActions:bindActionCreators(detailActions,dispatch)
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(Purchase)