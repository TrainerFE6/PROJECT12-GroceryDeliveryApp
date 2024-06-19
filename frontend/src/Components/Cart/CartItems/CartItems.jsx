import React, { useContext } from 'react';
import CartItemCard from '../CartItemCard/CartItemCard';
import { groceryContext } from '../../Layout/Layout';

const CartItems = ({ cartItems, getCartItems }) => {
    // Get Cart Items from Context
    // const { cartItemsState } = useContext(groceryContext);
    // const [cartItems, setCartItems] = cartItemsState;

    console.log('cartItems', cartItems)

    return (
        <div className='lg:space-y-10 space-y-5'>
            {/* Title */}
            <h2 className='lg:text-2xl sm:text-xl text-lg sm:font-semibold font-bold '>
                Keranjang Belanja
            </h2>

            {/* Items Card list */}
            <div className='space-y-3'>
                {cartItems?.map(cartItem => (
                    <CartItemCard
                        item={cartItem}
                        key={cartItem.id}
                        getCartItems={getCartItems} />
                ))}

            </div>
        </div>
    );
};

export default CartItems;