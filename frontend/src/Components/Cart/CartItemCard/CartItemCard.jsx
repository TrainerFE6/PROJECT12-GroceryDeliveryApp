import { Button, Fade, IconButton, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Add, Remove } from "@mui/icons-material";
import { useContext, useEffect, useState } from 'react';
import { groceryContext } from '../../Layout/Layout';
import { handleSessionStorage } from '../../../utils/utils';
import PopUpDialog from '../../PopUpDialog/PopUpDialog';
import { asset } from '../../../url';
import instance from '../../../https/core';

const CartItemCard = ({ item, getCartItems }) => {

    const { id, Product, quantity, price, subtotal } = item;
    const activeImage = Product.ProductImages?.length > 0 ? asset(Product.ProductImages[0].path) : '';
    const format_price = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(price) || '-';
    const format_subtotal = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(subtotal) || '-';

    // Get Cart Items from Context
    const { cartItemsState } = useContext(groceryContext);
    const [cartItems, setCartItems] = cartItemsState;

    const [openDialog, setOpenDialog] = useState(0);

    // Remove Item Handler
    const handleRemoveItem = async () => {
        // const trimmedCart = cartItems.filter(item => item.id !== id)
        // setCartItems(trimmedCart)
        // handleSessionStorage('set', 'cartItems', trimmedCart)
        // item.id = 0;
        await instance.post('cart/delete', { id: id });

        getCartItems();
        setOpenDialog(!openDialog)
    }

    return (
        <>
            <PopUpDialog
                open={openDialog !== 0}
                handleRemove={handleRemoveItem}
                handleCancel={()=> setOpenDialog(!openDialog)}
                message={'Ingin menghapus barang ini?'} />

            <Fade in={true}>
                <div className='grid max-w-[40rem] py-2.5 px-3 xl:grid-cols-5 sm:grid-cols-6 grid-cols-7 lg:gap-x-2.5 gap-x-2 rounded-md w-full bg-white hover:shadow-sm'>
                    {/*Img */}
                    <div className='col flex items-center justify-center'>
                        <img
                            src={activeImage}
                            className='lg:h-16 h-10'
                            alt={Product.name} />
                    </div>

                    <div className='col-span-2 overflow-hidden pt-2'>
                        <div className=' overflow-hidden lg:space-y-2 space-y-0.5'>
                            {/* Name */}
                            <h4 className='font-semibold lg:max-h-none max-h-10 overflow-hidden lg:text-gray-700 sm:text-sm text-xs'>
                                {Product.name}
                            </h4>
                        </div>
                    </div>

                    <div className='flex sm:col-span-1 col-span-2 justify-center items-center'>
                        <div className='lg:space-y-1 md:space-y-0 sm:space-y-0.5'>
                            {/*Total Price */}
                            <h3 className='font-semibold whitespace-nowrap sm:text-base text-sm text-green-600'>
                                {format_subtotal}
                            </h3>

                            {/* Remove-Item btn */}
                            <div className='text-center'>
                                <IconButton
                                    onClick={()=> setOpenDialog(!openDialog)}
                                    sx={{ textTransform: 'capitalize', opacity: 0.7 }}
                                    color='inherit'
                                    size='small'>
                                    <DeleteIcon fontSize='inherit' />
                                </IconButton>
                            </div>

                        </div>
                    </div>

                    {/* Item Quantity Control */}
                    <div className='flex items-center justify-center xl:col-span-1 col-span-2'>
                        <QuantityController
                            item={item} getCartItems={getCartItems} />
                    </div>
                </div>
            </Fade></>
    );
};

// Quantity Controller
const QuantityController = ({ item, getCartItems }) => {
    const { quantity, price, id } = item;
    const [productQuantity, setProductQuantity] = useState(quantity);

    // Get Cart Items from Context
    const { cartItemsState } = useContext(groceryContext);
    const [cartItems, setCartItems] = cartItemsState;

    // Event Handlers
    const handleReduce = async () => {
        // productQuantity > 1 && setProductQuantity(productQuantity - 1)
        if (productQuantity > 1) {
            await instance.post('cart/update-quantity', {
                id: id,
                quantity: productQuantity - 1
            })
            setProductQuantity(productQuantity - 1)
            getCartItems();
        }
    }
    const handleIncrement = () => {
        // setProductQuantity(productQuantity + 1)
        instance.post('cart/update-quantity', {
            id: id,
            quantity: productQuantity + 1
        })
        setProductQuantity(productQuantity + 1)
        getCartItems();
    }

    // Update Cart
    useEffect(() => {
        const updatedCart = cartItems.map(item => {
            if (item.id === id) {
                return {
                    ...item,
                    quantity: productQuantity,
                    total: (productQuantity * price).toFixed(2)
                }

            } else {
                return item
            }
        })
        setCartItems(updatedCart)
        handleSessionStorage('set', 'cartItems', updatedCart)
    }, [productQuantity])

    return (
        <div className={'flex items-center justify-center my-auto lg:space-x-2.5 sm:space-x-2 space-x-1.5'}>

            {/* Reduce Quantity */}
            <IconButton
                size={'small'}
                disabled={productQuantity < 2}
                onClick={handleReduce}
            >
                <Remove fontSize='inherit' />
            </IconButton>

            {/* Current Quantity*/}
            <h1 className={'my-auto lg:text-xl lg:font-medium font-semibold text-gray-700 whitespace-nowrap'}>
                {productQuantity}
            </h1>

            {/* Increase Quantity */}
            <IconButton
                size={'small'}
                onClick={handleIncrement}
                color='success'>
                <Add fontSize='inherit' />
            </IconButton>
        </div>
    )
}

export default CartItemCard;