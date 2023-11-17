import React, { useContext, useState, useEffect } from 'react';
import { GlobalState } from '../../../GlobalState';
import axios from 'axios';
// import PaypalButton from './PaypalButton';
//import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { Link } from 'react-router-dom';

function Cart() {
    const state = useContext(GlobalState);
    //console.log(state.userAPI);
    const [cart, setCart] = state.userAPI.cart;
    //const addOrder = state.orderAPI.order;
    const [token] = state.token;
    const [total, setTotal] = useState(0);
    console.log(cart);

    useEffect(() => {
        const getTotal = () => {
            const total = cart.reduce((prev, item) => {
                return prev + item.types[0].price * item.quantity;
            }, 0);

            setTotal(total);
            //console.log("total" + total)
        };

        getTotal();
    }, [cart]);

    const addToCart = async (cart) => {
        try {
            await axios.patch(
                '/user/addcart',
                { cart },
                {
                    headers: { Authorization: `Bearer ${token}` },
                },
            );
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };

    const increment = (id) => {
        cart.forEach((item) => {
            if (item._id === id) {
                item.quantity += 1;
            }
        });

        setCart([...cart], () => {
            addToCart(cart);
        });
    };

    const decrement = (id) => {
        cart.forEach((item) => {
            if (item._id === id) {
                item.quantity === 1 ? (item.quantity = 1) : (item.quantity -= 1);
            }
        });

        setCart([...cart]);
        addToCart(cart);
    };

    const removeProduct = (id) => {
        if (window.confirm('Do you want to delete the product?')) {
            cart.forEach((item, index) => {
                if (item._id === id) {
                    cart.splice(index, 1);
                }
            });

            setCart([...cart]);
            addToCart(cart);
        }
    };

    const tranSuccess = async (payment) => {
        console.log('payment = ' + payment);
        const { paymentID, address } = payment;

        //paypal
        await axios.post(
            '/api/payment',
            { cart, paymentID, address },
            {
                headers: { Authorization: token },
            },
        );

        setCart([]);
        addToCart([]);
        alert('Your order has been successfully placed.');
    };
    // hom qua lam toi day
    const Checkout = async (e) => {
        e.preventDefault();
        await axios.post(
            '/api/orders/checkout',
            { cart },
            {
                headers: { Authorization: token },
            },
        );
    };

    if (cart.length === 0) return <h2 style={{ textAlign: 'center', fontSize: '2rem' }}>No product </h2>;
    return (
        <div>
            <form onSubmit={Checkout}>
                {cart.map((product, type) => (
                    <div className="detail cart" key={product._id}>
                        <img src={product.images.url} alt="" />

                        <div className="box-detail">
                            <h2>{product.title}</h2>
                            <h3>￥ {product.types[0].price * product.quantity}</h3>
                            <p>{product.description}</p>
                            <div className="amount">
                                {/* <button onClick={() => decrement(product._id)}> - </button> */}
                                <button> - </button>
                                <span>{product.quantity}</span>
                                {/* <button onClick={() => increment(product._id)}> + </button> */}
                                <button> + </button>
                            </div>
                            <div className="delete" onClick={() => removeProduct(product._id)}>
                                X
                            </div>
                        </div>
                    </div>
                ))}

                <div className="total">
                    <h3>全部: ￥ {total}</h3>
                    {/* <PaypalButton total={total} tranSuccess={tranSuccess} /> */}
                    <Link
                    // to="/checkout"
                    // className="checkout"
                    // onClick={() => {
                    //     console.log(JSON.stringify(cart));
                    // }}
                    >
                        Checkout
                    </Link>
                </div>
            </form>
        </div>
    );
}
// cart
export default Cart;
