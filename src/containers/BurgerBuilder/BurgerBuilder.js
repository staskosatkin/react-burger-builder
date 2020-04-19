import React, {Component} from 'react';
import { connect } from 'react-redux';

import axios from '../../axios-orders';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Aux from '../../hoc/Aux/Aux';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../store/actions/index';

export class BurgerBuilder extends Component {
    state = {
        purchasing: false
    }

    componentDidMount() {
        this.props.onInitIngredients();
    }

    updatePurchaseState = (ingredients) => {
        const sum = Object.keys(ingredients)
            .map((igKey) => ingredients[igKey])
            .reduce((sum, el) => sum + el , 0);

        return sum > 0;
    }

    purchageHandler = () => {
        if (this.props.isAuthenticated) {
            this.setState({purchasing: true});
        } else {
            this.props.onSetRedirectPath('/checkout');
            this.props.history.push('/auth');
        }
    }

    purchageCanceledHandler = () => {
        this.setState({purchasing: false});
    }

    purchageContinueHandler = () => {
        this.props.onInitPurchase()
        this.props.history.push('/checkout');
    }

    render() {

        const disabledInfo = {
            ...this.props.ings
        };

        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0
        }

        let burger = this.props.error ? <p>Ingredients can't be loaded</p> :<Spinner />;
        let orderSummary = null;

        if (this.props.ings) {
            burger = (
                <Aux>
                    <Burger ingredients={this.props.ings} />
                    <BuildControls 
                            ingredientAdded={this.props.onIngredientAdded}
                            ingredientRemoved={this.props.onIngredientRemoved}
                            disabled={disabledInfo}
                            purchasable={this.updatePurchaseState(this.props.ings)}
                            ordered={this.purchageHandler}
                            isAuth={this.props.isAuthenticated}
                            price={this.props.price}
                        />
                </Aux>
            );

            orderSummary = <OrderSummary
                price={this.props.price}
                purchaseCanceled={this.purchageCanceledHandler}
                purchaseContinued={this.purchageContinueHandler}
                ingredients={this.props.ings} />
        }

        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchageCanceledHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        );
    }
}

const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        error: state.burgerBuilder.error,
        isAuthenticated: state.auth.token !== null
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onInitIngredients: () => dispatch(actions.initIngredients()),
        onIngredientAdded: (ingredientName) => dispatch(actions.addIngredient(ingredientName)),
        onIngredientRemoved: (ingredientName) => dispatch(actions.removeIngredient(ingredientName)),
        onInitPurchase: () => dispatch(actions.purchaseInit()),
        onSetRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));
