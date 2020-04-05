import React from 'react';
import { withRouter } from 'react-router-dom';

import classes from './Burger.module.css';
import BurgerIngredient from './BurgerIngredient/BurgerIngredient';

const burder = (props) => {
    let transformedIngrediens = Object.keys(props.ingredients)
        .map(igKey => {
            const count = parseInt(props.ingredients[igKey], 10) || 0;
            return [...Array(count)].map((_, index) => {
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

export default withRouter(burder);
