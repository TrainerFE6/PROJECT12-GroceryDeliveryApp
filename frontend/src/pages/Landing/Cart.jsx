import { useNavigate } from "react-router-dom";
import EmptyCart from '../../Components/Cart/EmptyCart/EmptyCart';
import { Container, Fade } from "@mui/material";
import { createContext, useContext, useEffect, useState } from "react";
import OrderSummary from "../../Components/Cart/OrderSummary/OrderSummary";
import CartItems from "../../Components/Cart/CartItems/CartItems";
import { groceryContext } from "../../Components/Layout/Layout";
import DeliveryForm from "../../Components/Cart/DeliveryForm/DeliveryForm";
import instance from "../../https/core";

export const checkoutContext = createContext();
const Cart = () => {
    // Scrolling Bug Fixed
    window.scroll({ top: 0 });
    const user = localStorage.getItem('user');
    const navigate = useNavigate();

    const [shipping, setShipping] = useState({});
    const [payment, setPayment] = useState({});

    const [isLoading, setIsLoading] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [isProceedToCheckout, setIsProceedToCheckout] = useState(false);

    const getCartItems = async () => {
        try {
            setIsLoading(true);
            const res = await instance.get('cart/list');
            setCartItems(res.data);
            setIsLoading(false);
        } catch (error) {
            throw new Error('Cart Fetch Failed', error);
        }
    }

    useEffect(() => {
        if (!user) {
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            navigate('/');
        }

        getCartItems();
    }, []);

    useEffect(() => {
        console.log('Cart Items Changed', cartItems)
    }, [cartItems])

    return (
        <checkoutContext.Provider value={[isProceedToCheckout, setIsProceedToCheckout]}>
            <section className={`${cartItems.length > 0 ? 'min-h-screen ' : 'h-screen '}pt-20 pb-10`}>
                {cartItems.length > 0 ?
                    <Container sx={{ display: 'flex', justifyContent: 'center', height: '100%' }}>
                        <section className="grid lg:gap-x-0 gap-x-5 gap-y-8 w-full xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-12 ">
                            <div className='col xl:col-span-2 lg:col-span-1 md:col-span-8'>
                                {!isProceedToCheckout ?
                                    <CartItems cartItems={cartItems} getCartItems={getCartItems} />
                                    : <DeliveryForm setShipping={setShipping} setPayment={setPayment} />
                                }
                            </div>
                            <OrderSummary cartItems={cartItems} shipping={shipping} payment={payment} />
                        </section>
                    </Container>

                    : <EmptyCart cartItems={cartItems} isLoading={isLoading} />
                }
            </section>
        </checkoutContext.Provider>
    );
};

export default Cart;