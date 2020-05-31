import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import axios from '../../axios-orders';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Aux from '../../hoc/Aux/Aux';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../store/actions/index';

export const BurgerBuilder = props => {
    const [purchasing, setPurchasing] = useState(false);

    const dispatch = useDispatch();

    const ings = useSelector(state => state.burgerBuilder.ingredients);
    const price = useSelector(state => state.burgerBuilder.totalPrice);
    const error = useSelector(state => state.burgerBuilder.error);
    const isAuthenticated = useSelector(state => state.auth.token !== null);

    const onInitIngredients = useCallback(() => dispatch(actions.initIngredients()), [dispatch]);
    const onIngredientAdded = (ingredientName) => dispatch(actions.addIngredient(ingredientName));
    const onIngredientRemoved = (ingredientName) => dispatch(actions.removeIngredient(ingredientName));
    const onInitPurchase =  () => dispatch(actions.purchaseInit());
    const onSetRedirectPath = (path) => dispatch(actions.setAuthRedirectPath(path));

    useEffect(() => {
        onInitIngredients();
    }, [onInitIngredients]);

    const updatePurchaseState = (ingredients) => {
        const sum = Object.keys(ingredients)
            .map((igKey) => ingredients[igKey])
            .reduce((sum, el) => sum + el , 0);

        return sum > 0;
    }

    const purchageHandler = () => {
        if (isAuthenticated) {
            setPurchasing(true);
        } else {
            onSetRedirectPath('/checkout');
            props.history.push('/auth');
        }
    }

    const purchageCanceledHandler = () => {
        setPurchasing(false);
    }

    const purchageContinueHandler = () => {
        onInitPurchase()
        props.history.push('/checkout');
    }

    const disabledInfo = {
        ...ings
    };

    for (let key in disabledInfo) {
        disabledInfo[key] = disabledInfo[key] <= 0
    }

    let burger = error ? <p>Ingredients can't be loaded</p> :<Spinner />;
    let orderSummary = null;

    if (ings) {
        burger = (
            <Aux>
                <Burger ingredients={ings} />
                <BuildControls 
                        ingredientAdded={onIngredientAdded}
                        ingredientRemoved={onIngredientRemoved}
                        disabled={disabledInfo}
                        purchasable={updatePurchaseState(ings)}
                        ordered={purchageHandler}
                        isAuth={isAuthenticated}
                        price={price}
                    />
            </Aux>
        );

        orderSummary = <OrderSummary
            price={price}
            purchaseCanceled={purchageCanceledHandler}
            purchaseContinued={purchageContinueHandler}
            ingredients={ings} />
    }

    return (
        <Aux>
            <Modal show={purchasing} modalClosed={purchageCanceledHandler}>
                {orderSummary}
            </Modal>
            {burger}
        </Aux>
    );
}

export default withErrorHandler(BurgerBuilder, axios);
