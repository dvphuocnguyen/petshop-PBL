import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GlobalState } from '../../../GlobalState';
import axios from 'axios';

const ItemCorrect = (items) => {
    const state = useContext(GlobalState);
    const [item, setItem] = useState(items.item);
    const [checkdelivery, setcheckdelivery] = useState(false);
    const [token] = state.token;
    console.log(item);
    useEffect(() => {
        setItem(items.item);
    }, [items]);
    const confirm = async (id) => {
        // e.preventDefault();
        if (item.delivery != null) {
            return alert('This order has been delivered.');
        }
        var delivery = window.prompt('Type delivery_Id');
        item.delivery = delivery;
        console.log(item.delivery);
        console.log(delivery);
        const rs = {
            delivery_id: delivery,
            order_id: id,
        };
        item.delivery !== null ? (item.status = 'Confirmed') : (item.status = item.status);
        console.log(item.status);
        // console.log(rs.delivery_id);
        if (window.confirm('Confirm this order?')) {
            setcheckdelivery(false);
            console.log(rs);
            await axios.put(
                '/api/delivery',
                { ...rs },
                {
                    headers: { Authorization: token },
                },
            );
            setcheckdelivery(true);
            console.log(rs);
            alert('This order has been confirm');
        } else {
            alert('No');
        }
        // const id = e.target.value;
        // console.log(id);
    };
    console.log(item);
    console.log(item.status);

    return (
        <>
            <tr key={item._id}>
                <td>{item._id}</td>
                <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                <td>{item.address}</td>
                <td>{item.phone}</td>
                <td>{item.status}</td>
                <td>
                    <button type="button" onClick={() => confirm(item._id)}>
                        {item.delivery == null ? (
                            <img
                                className="img-correct"
                                src="https://cdn-icons-png.flaticon.com/128/7698/7698976.png"
                                alt=""
                            />
                        ) : (
                            <img
                                className="img-correct"
                                src="https://cdn-icons-png.flaticon.com/128/8888/8888205.png"
                                alt=""
                            />
                        )}
                    </button>
                </td>
                <td>
                    <Link to={`/history/${item._id}`}>見る</Link>
                </td>
            </tr>
        </>
    );
};

export default ItemCorrect;
