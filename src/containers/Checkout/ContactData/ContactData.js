import React, { Component } from 'react';

import axios from '../../../axios-orders';
import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import classes from './ContactData.module.css';

class ContactData extends Component {
    state = {
        name: '',
        email: '',
        address: {
            street: '',
            postalCode: ''
        },
        loading: false
    }

    orderHandler = (event) => {
        event.preventDefault();
        console.log(this.props.ingredients);

        this.setState({loading: true});

        const order = {
            ingredients: this.props.ingredients,
            price: this.props.price,
            customer: {
                name: 'Stan',
                adress: {
                    street: 'Test Street',
                    zip: '10115',
                    country: 'Germany'
                },
                email: 'test@test.com'
            },
            deliveryMethod: 'fastest'
        }

        axios.post('/orders.json', order)
            .then(respose => {
                this.setState({loading: false});
                this.props.history.push('/');
            })
            .catch(error => {
                this.setState({loading: false});
                console.log(error)
            });
    }

    render() {

        let form = (
            <form>
                    <input className={classes.Input} type="text" name="name" placeholder="Your Name" />
                    <input className={classes.Input} type="email" name="email" placeholder="Your Mail" />
                    <input className={classes.Input} type="text" name="streer" placeholder="Street" />
                    <input className={classes.Input} type="text" name="postal" placeholder="Postal Code" />
                    <Button btnType="Success" clicked={this.orderHandler}>ORDER</Button>
            </form>
        );
        if (this.state.loading) {
            form = <Spinner />
        }

        return (
            <div className={classes.ContactData}>
                <h4>Enter your Contact Data</h4>
                {form}
            </div>
        );
    }
}

export default ContactData;