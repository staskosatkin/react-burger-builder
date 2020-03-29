import React from 'react';

import classes from './Burger.module.css';
import BurgerIngredient from './BurgerIngredient/BurgerIngredient';

const burder = (props) => {

    let transformedIngrediens = Object.keys(props.ingredients)
        .map(igKey => {
            return [...Array(props.ingredients[igKey])].map((_, index) => {
                    return <BurgerIngredient key={igKey + index} type={igKey} />
                });
        })
        .reduce((arr, el) => {
            return arr.concat(el);
        }, []);

        if (transformedIngrediens.length === 0) {
            transformedIngrediens = <p>Please start adding ingredients</p>;
        }

    return (
        <div className={classes.Burger}>
            <BurgerIngredient type="bread-top" />
            {transformedIngrediens}
            <BurgerIngredient type="bread-bottom" />
        </div>
    );
};

export default burder;
