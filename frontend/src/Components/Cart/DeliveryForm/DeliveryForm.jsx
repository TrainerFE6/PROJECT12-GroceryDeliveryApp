import { Button, Fade, TextField } from '@mui/material';
import { useForm } from "react-hook-form";
import { groceryContext } from '../../Layout/Layout';
import { useContext, useEffect, useState } from 'react';
import GoBackButton from '../GoBackButton/GoBackButton';
import { handleSessionStorage } from '../../../utils/utils';
import PopUpDialog from '../../PopUpDialog/PopUpDialog';
import { useNavigate } from 'react-router-dom';
import instance from '../../../https/core';

const DeliveryForm = ({ cartItems, setShipping, setPayment }) => {
    const [openDialog, setOpenDialog] = useState(false);

    const [shippings, setShippings] = useState([]);
    const [payments, setPayments] = useState([]);

    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm();

    const navigate = useNavigate()

    // Handle PlaceOrder
    const onSubmit = (data) => {
        setOpenDialog(!openDialog)
        // Setting DeliveryDetails in Storage
        handleSessionStorage('set', 'deliveryDetails', data)
    }
    // Handle Dialog 
    const handleOK = () => {
        setOpenDialog(!openDialog)
        navigate('/')
    }

    const handleShippingCode = (item) => {
        // console.log(e.target.value)
        setValue('shipping_code', item.service)
        setShipping(item)
    }

    const handlePaymentCode = (item) => {
        // console.log(e.target.item)
        setValue('payment_code', item.code)
        setPayment(item)
    }

    const fetchShipping = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'))
            setShipping({})
            const res = await instance.post('raja-ongkir/cost', {
                origin: user.city_id,
                destination: 501,
                weight: 1000,
                courier: 'jne'
            })
            setShippings(res.data[0].costs)
        } catch (error) {
            console.log('Shipping Fetch Failed', error)
        }
    }

    const fetchPayment = async () => {
        try {
            setPayment({})
            const res = await instance.post('tripay/get-payment')
            setPayments(res.data)
        } catch (error) {
            console.log('Payment Fetch Failed', error)
        }
    }

    useEffect(() => {
        if (shippings.length === 0) fetchShipping()
        if (payments.length === 0) fetchPayment()
    }, [])

    return (
        <>
            <PopUpDialog
                open={openDialog}
                message={'Order Placed successfully'}
                handleOk={handleOK}
                placeOrder={true} />
            <div className='md:mx-0 mx-auto space-y-4 max-w-[37rem]'>
                {/* Go back Btn */}
                <GoBackButton />
                <div className='space-y-9 lg:space-y-10 '>
                    {/* Title */}
                    {/* <h1 className='lg:text-2xl text-xl font-semibold text-gray-600'>
                        Pembayaran & Pengiriman
                    </h1> */}

                    {/* Delivery Form */}
                    <Fade in={true}>
                        <form 
                            action="post"
                            className='lg:space-y-8  space-y-7'
                            onSubmit={handleSubmit(onSubmit)}
                        >
                            <fieldset className="space-y-6">
                                <div className="flex items-center justify-between py-4 border-b border-gray-300">
                                    <h1 className='lg:text-2xl text-xl font-semibold text-gray-600'>Pengiriman</h1>
                                    <a href="#" className="font-medium text-gray-500 hover:text-gray-700">Jalur Nugraha Ekakurir (JNE)</a>
                                </div>
                                <div className="grid sm:grid-cols-2 gap-6">
                                    {shippings.map((shipping, index) => (
                                        <label key={`shipping-${index}`} className="relative flex flex-col bg-white p-5 rounded-lg shadow-md cursor-pointer" onClick={() => handleShippingCode(shipping)}>
                                            <span className="font-semibold text-gray-500 leading-tight uppercase mb-0">{shipping.service}</span>
                                            <p className="mb-3">{shipping.description}</p>
                                            <span className="font-bold text-gray-900">
                                                {/* <span className="text-4xl">1</span> */}
                                                <span className="text-2xl uppercase">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(shipping.cost[0].value) || '-'}</span>
                                            </span>
                                            <input
                                                type="radio"
                                                {...register("shipping_code", { required: true })}
                                                value={shipping.service}
                                                className="absolute h-0 w-0 appearance-none"
                                            />
                                            <span aria-hidden="true" className={`${watch('shipping_code') === shipping.service ? '' : 'hidden'} absolute inset-0 border-2 border-green-500 bg-green-200 bg-opacity-10 rounded-lg`}>
                                                <span className="absolute top-4 right-4 h-6 w-6 inline-flex items-center justify-center rounded-full bg-green-200">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-green-600">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                                </span>
                                            </span>
                                        </label>
                                    ))}

                                </div>
                            </fieldset>

                            <fieldset className="space-y-6">
                                <div className="flex items-center justify-between py-4 border-b border-gray-300">
                                    <h1 className='lg:text-2xl text-xl font-semibold text-gray-600'>Pembayaran</h1>
                                </div>
                                <div className="grid sm:grid-cols-2 gap-6">
                                    {payments.map((payment, index) => (
                                        <label key={`payment-${index}`} className="relative flex flex-col bg-white p-5 rounded-lg shadow-md cursor-pointer" onClick={() => handlePaymentCode(payment)}>
                                            <div className="flex gap-4">
                                                <img src={payment.icon_url} alt={payment.code} width={30} />
                                                <span className="font-semibold text-gray-500 leading-tight uppercase mb-0">{payment.code}</span>
                                            </div>
                                            <p className="mb-3">{payment.name}</p>
                                            <span className="font-bold text-gray-900">
                                                {/* <span className="text-4xl">1</span> */}
                                                <span className="text-2xl uppercase">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(payment.fee) || '-'}</span>
                                            </span>
                                            <input
                                                type="radio"
                                                {...register("payment_code", { required: true })}
                                                value={payment.code}
                                                className="absolute h-0 w-0 appearance-none"
                                            />
                                            <span aria-hidden="true" className={`${watch('payment_code') === payment.code ? '' : 'hidden'} absolute inset-0 border-2 border-green-500 bg-green-200 bg-opacity-10 rounded-lg`}>
                                                <span className="absolute top-4 right-4 h-6 w-6 inline-flex items-center justify-center rounded-full bg-green-200">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-green-600">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                                </span>
                                            </span>
                                        </label>
                                    ))}

                                </div>
                            </fieldset>
                            
                            {/* Submit Button */}
                            {/* <Button type='submit'
                                fullWidth
                                variant='contained'
                                sx={{ textTransform: 'capitalize' }}
                                color='success'>
                                Checkout Sekarang
                            </Button> */}
                        </form>
                    </Fade>
                </div>
            </div>
        </>
    );
};

export default DeliveryForm;