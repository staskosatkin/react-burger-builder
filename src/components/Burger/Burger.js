import React from 'react';

import classes from './Burger.module.css';
import BurgerIngredient from './BurgerIngredient/BurgerIngredient';

const burder = (props) => {
    return (
        <div class={classes.Burger}>
            <BurgerIngredient type="bread-top" />

            <BurgerIngredient type="cheese" />
            <BurgerIngredient type="meat" />

            <BurgerIngredient type="bread-bottom" />
        </div>
    );
};

export default burder;
