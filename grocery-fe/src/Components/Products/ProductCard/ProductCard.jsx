import { Button, Card, CardActions, CardContent, CardMedia, Fade, Rating, Skeleton, useMediaQuery } from '@mui/material';
import { Star } from '@mui/icons-material';
import { useContext, useState } from 'react';
import { groceryContext } from '../../Layout/Layout';
import { handleSessionStorage } from '../../../utils/utils';
import SuccessAlert from '../../SuccessAlert/SuccessAlert';
import { asset } from '../../../url';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
    const { 
        id,
        name,
        Category,
        ProductImages,
        sku,
        description,
        min_order,
        weight,
        price,
        stock,
        quantity
     } = product;
     const navigate = useNavigate();

     const img = ProductImages?.length > 0 ? (
        <img
          src={asset(ProductImages[0].path)}
          alt="gambar"
          className="w-10 h-10"
        />
      ) : (
        <span>-</span>
      );

    // Media Query
    const isMediumScreen = useMediaQuery('(min-width: 768px) and (max-width: 1024px)');
    const isSmallScreen = useMediaQuery('(max-width:768px)');

    const [openAlert, setOpenAlert] = useState(false)
    const { cartItemsState } = useContext(groceryContext);
    const [cartItems, setCartItems] = cartItemsState;

    //Handle Add To Cart
    const handleAddToCartBtn = () => {
        let targetedProduct = product;
        let latestCartItems = cartItems;

        const isTargetedProductAlreadyExist = cartItems.find(item => item.id === product.id)
        if (isTargetedProductAlreadyExist) {
            targetedProduct = {
                ...isTargetedProductAlreadyExist,
                quantity: isTargetedProductAlreadyExist.quantity + 1,
                total: ((isTargetedProductAlreadyExist.quantity + 1) * isTargetedProductAlreadyExist.price).toFixed(2)
            }
            latestCartItems = cartItems.filter(item => item.id !== targetedProduct.id)
        }
        setCartItems([
            targetedProduct,
            ...latestCartItems
        ])
        handleSessionStorage('set', 'cartItems', [
            targetedProduct,
            ...latestCartItems
        ])

        setOpenAlert(!openAlert)
    }

    const handleProductPage = () => {
        // console.log('product ' + id)
        navigate(`/product/${id}`)
    };

    return (
        <div>
            <SuccessAlert
                state={[openAlert, setOpenAlert]}
                massage={'Produk Berhasil Ditambahkan'} />

            <Fade in={true}>
                <Card className='border border-[#9e9e9e]' sx={{ maxWidth: isSmallScreen ? 275 : 295, mx: 'auto', boxShadow: '0 2px 4px -1px rgb(0 0 0 / 0.1)', backgroundColor: 'white' }}>

                    {/* Product_img */}
                    {/* Note: Transparent or solid white background img required */}
                    <div className='md:h-36 py-3 w-full bg-white flex items-center justify-center'>
                        {/* <img className='md:max-h-28 max-h-24'
                            loading='lazy'
                            src={img}
                            alt={name} /> */}
                        {ProductImages?.length > 0 ? (
                            <img
                                src={asset(ProductImages[0].path)}
                                alt="gambar"
                                className="md:max-h-28 max-h-24"
                            />
                        ) : (
                            <span>-</span>
                        )}
                    </div>
                    <div className='p-1.5'>
                        <CardContent className='md:space-y-2 space-y-1.5 cursor-pointer' onClick={handleProductPage}>
                            {/* title */}
                            <h3 className='md:text-xl lg:text-2xl text-xl text-gray-700 font-semibold text-center capitalize'>
                                {name}
                            </h3>
                            <div className='md:space-y-1.5 space-y-2 lg:space-y-2'>
                                <div className='flex justify-center space-x-5'>
                                    {/* Amount */}
                                    <span className='block text-sm md:text-xs lg:text-sm'>
                                        ± {weight} gr
                                    </span>
                                    {/* Price */}
                                    <span className='block text-sm md:text-xs lg:text-sm'>
                                        {price}
                                    </span>
                                </div>
                                
                            </div>
                        </CardContent>
                        {/* <CardActions>
                            <Button
                                sx={{ textTransform: 'capitalize', marginX: 'auto', ":hover": { bgcolor: '#2e7d32', color: 'white', transition: 'all 235ms ease-in-out' } }}
                                fullWidth
                                onClick={handleAddToCartBtn}
                                size={isMediumScreen ? 'small' : 'medium'}
                                variant='outlined'
                                color='success'>
                                Tambah ke keranjang
                            </Button>
                        </CardActions> */}
                    </div>
                </Card>
            </Fade>
        </div>
    );
};

// ProductCard Skeleton
export const ProductCardSkeleton = () => (
    <div>
        <Card sx={{ maxWidth: 308, mx: 'auto', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)', backgroundColor: 'white' }}>

            {/* Product_img */}
            <Skeleton
                variant='rectangular'
                height={170}
                width={'100%'} />

            <div className='px-1.5 pb-2'>
                <CardContent className='space-y-2' sx={{ pb: 1 }}>
                    {/* title */}
                    <Skeleton
                        sx={{ mx: 'auto' }}
                        variant='text'
                        height={'3rem'}
                        width={'55%'} />

                    <div className='md:space-y-1.5 space-y-2 lg:space-y-2'>
                        <div className='flex justify-center space-x-5'>
                            {/* Amount */}
                            <Skeleton
                                variant='text'
                                height={'1.3rem'}
                                width={'30%'} />

                            {/* Price */}
                            <Skeleton
                                variant='text'
                                height={'1.3rem'}
                                width={'25%'} />
                        </div>

                        <div className='flex justify-center'>
                            {/* Ratings */}
                            <Skeleton
                                variant='text'
                                height={'1.6rem'}
                                width={'80%'} />
                        </div>
                    </div>
                </CardContent>

                {/* Add To Cart Btn */}
                <CardActions sx={{ pt: 0 }}>
                    <Skeleton
                        variant='rounded'
                        height={'1.9rem'}
                        width={'100%'} />
                </CardActions>
            </div>
        </Card>
    </div>
)
export default ProductCard;