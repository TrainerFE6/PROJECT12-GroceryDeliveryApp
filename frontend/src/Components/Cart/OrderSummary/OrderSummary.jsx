import { Button, useMediaQuery } from '@mui/material';
import { groceryContext } from '../../Layout/Layout';
import { useContext, useEffect, useState } from 'react';
import { checkoutContext } from '../../../pages/Landing/Cart';
import instance from '../../../https/core';
import { useNavigate } from 'react-router-dom';

const OrderSummary = ({cartItems,shipping = {},payment = {}}) => {
    // Get Cart Items from Context
    const [isProceedToCheckout, setIsProceedToCheckout] = useContext(checkoutContext);
    const navigate = useNavigate();
    const [isLoadingCheckout, setIsLoadingCheckout] = useState(false);

    // Media Query
    const isMediumScreen = useMediaQuery('(max-width:1024px)');

    const subtotal = Number.parseFloat(cartItems.reduce((subtotal, item) => subtotal + Number.parseFloat(item.subtotal), 0));

    const format_subtotal = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(subtotal) || '-';

    const rupiah = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' });

    const [total, setTotal] = useState(0);

    const calculateTotal = () => {
        console.log('payment', payment)
        const paymentFee = (payment && payment.code) ? parseFloat(payment.fee) : 0;
        // const shippingCost = 0;
        const shippingCost = (shipping && shipping.cost && shipping.cost.length) ? shipping?.cost[0].value : 0;
        const total = subtotal + shippingCost + paymentFee;
        setTotal(total);
    };

    const handleCheckout = async () => {
        try {
            setIsLoadingCheckout(true);
            const items = cartItems.map(item => ({
                product_id: item.product_id,
                sku: item.Product.sku,
                name: item.Product.name,
                price: item.price,
                quantity: item.quantity,
                product_url: 'https://grocery.web-ditya.my.id/product/' + item.product_id,
            }));
    
            const additional = [
                {
                    sku: 'shipping',
                    name: `Biaya Pengiriman ${shipping.service}`,
                    price: (shipping && shipping.cost && shipping.cost.length) ? shipping?.cost[0].value : 0,
                    quantity: 1,
                    product_url: 'https://grocery.web-ditya.my.id',
                },
                {
                    sku: 'payment',
                    name: `Biaya Pembayaran ${payment.code}`,
                    price: (payment && payment.code) ? parseFloat(payment.fee) : 0,
                    quantity: 1,
                    product_url: 'https://grocery.web-ditya.my.id',
                }
            ];
    
            const payload = {
                payment_method_id: payment.id,
                shipping_code: 'jne',
                shipping_service: shipping.service,
                product_price: subtotal,
                shipping_price: (shipping && shipping.cost && shipping.cost.length) ? shipping?.cost[0].value : 0,
                payment_price: (payment && payment.code) ? payment.fee : 0,
                total_price: total,
                carts: items,
                additional: additional
            }
    
            const res = await instance.post('/transaction/create', payload);
            navigate('/dashboard/detail/' + res.data.id);
            setIsLoadingCheckout(false);
            setTimeout(() => {
    
                const link = document.createElement('a');
                link.href = `https://tripay.co.id/checkout/${res.data.payment_reference}`;
                link.target = '_blank';
                link.rel = 'noopener noreferrer';
                link.click();
    
            }, 1000);
        } catch (error) {
            setIsLoadingCheckout(false);
            alert('Terjadi kesalahan saat melakukan pemesanan.');   
        }
    };

    useEffect(() => {
        calculateTotal();
    }, [shipping, payment, cartItems]);

    return (
        <div className='flex justify-center md:pt-16 col md:col-span-4 lg:col-span-1'>
            <div className={`lg:space-y-4 sticky top-0 bottom-0 w-full max-w-[25rem] space-y-3`}>
                {/* Title */}
                <h3 className='lg:text-xl text-lg sm:font-semibold font-bold tracking-wide'>Ringkasan Pembelian</h3>

                {/* Total Bill */}
                <table className='table-auto h-28 text-sm w-full'>
                    <tbody>
                        {/* Subtotal */}
                        <tr className='font-medium lg:text-gray-800 text-gray-6000'>
                            <td>Subtotal</td>
                            <td>{format_subtotal}</td>
                        </tr>
                        <tr className='font-medium lg:text-gray-800 text-gray-6000'>
                            <td>Pengiriman</td>
                            <td>{(shipping && shipping.cost && shipping.cost.length) ? `${shipping?.service} (${rupiah.format(shipping?.cost[0].value)})` : '-'}</td>
                        </tr>
                        <tr className='font-medium lg:text-gray-800 text-gray-6000'>
                            <td>Metode Pembayaran</td>
                            <td>{(payment && payment.code) ? `${payment?.code} (${rupiah.format(payment?.fee)})` : '-'}</td>
                        </tr>
                        <tr className='font-medium lg:text-gray-800 text-gray-6000 sm:font-semibold font-bold'>
                            <td>Total</td>
                            <td>{rupiah.format(total)}</td>
                        </tr>
                    </tbody>
                </table>

                {/* Proceed to checkout */}
                <Button
                    fullWidth
                    onClick={() => setIsProceedToCheckout(!isProceedToCheckout)}
                    sx={{ textTransform: 'capitalize', transition: 'display 1000s ease-in-out', display: isProceedToCheckout ? 'none' : 'block' }}
                    variant='contained'
                    size={isMediumScreen ? 'small' : 'medium'}
                    color='success'>
                    Pembayaran & Pengiriman
                </Button>

                <Button type='submit'
                    fullWidth
                    variant='contained'
                    sx={{ textTransform: 'capitalize', display: !isProceedToCheckout ? 'none' : 'block' }}
                    color='success'
                    disabled={!(shipping && shipping.cost && shipping.cost.length) || !(payment && payment.code) || isLoadingCheckout}
                    onClick={handleCheckout}
                >
                    {isLoadingCheckout ? 'Sedang Memproses ...' : 'Checkout Sekarang'}
                </Button>
            </div>
            <a href="" id="ref-link" target="_blank"></a>
        </div>
    );
};

export default OrderSummary;