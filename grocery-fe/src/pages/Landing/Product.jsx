import { Container, Fade } from '@mui/material';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import ProductCard, { ProductCardSkeleton } from '../../Components/Products/ProductCard/ProductCard';
import { useParams } from 'react-router-dom';
import instance from '../../https/core';
import { asset } from '../../url';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SuccessAlert from '../../Components/SuccessAlert/SuccessAlert';
import { groceryContext } from '../../Components/Layout/Layout';
import { handleSessionStorage } from '../../utils/utils';
// import { handleSessionStorage } from '../../../../utils/utils';

const ProductLanding = () => {
    const { id: id } = useParams();
    const [product, setProduct] = useState({});
    const [activeImage, setActiveImage] = useState('');
    
    const [isLoading, setIsLoading] = useState(true);

    const [openAlert, setOpenAlert] = useState(false)
    const { cartItemsState } = useContext(groceryContext);
    const [cartItems, setCartItems] = cartItemsState;

    // Scrolling Bug Fixed
    window.scroll({ top: 0 });

    const getData = async function () {
        try {
            const res = await instance.get(`products/landing/read?id=${id}`);
            const products = {
                id: res.data.id,
                name: res.data.name,
                Category: res.data.Category,
                ProductImages: res.data.ProductImages,
                sku: res.data.sku,
                description: res.data.description,
                min_order: res.data.min_order,
                weight: res.data.weight,
                price: res.data.price,
                format_price: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(res.data.price) || '-',
                stock: res.data.stock,
                quantity: res.data.min_order,
            }
            if (products?.ProductImages?.length > 0) setActiveImage(asset(products.ProductImages[0].path))
            setProduct(products)
            setIsLoading(!isLoading)
        }
        catch (error) {
            throw new Error('Products Fetch Failed', error)
        }
    };

    const handleAddToCartBtn = async () => {
        let targetedProduct = product;
        await instance.post('cart/upsert', {
            product_id: targetedProduct.id,
            quantity: targetedProduct.quantity,
            price: targetedProduct.price,
        });

        setOpenAlert(!openAlert)
    }

    // Get Products 
    useEffect(() => {
        getData();
    }, [])

    return (
        <main className='min-h-screen space-y-5 pt-20 mb-9'>
            <SuccessAlert
                state={[openAlert, setOpenAlert]}
                massage={'Produk Berhasil Ditambahkan'} />
            <Fade in={true}>
                <Container className='xl:space-y-10 sm:space-y-8 space-y-6'>
                    {/* Title */}
                    <h1 className='pb-0 md:text-2xl text-xl font-semibold text-gray-700 capitalize'>
                        Data Produk
                    </h1>

                    {/* Product_cards*/}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <img src={activeImage} alt="" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold mb-3">{product.name}</h1>
                            <p className="text-lg font-semibold mb-3">{product.format_price}</p>

                            <p>SKU: {product.sku}</p>
                            <p>Min Order: {product.min_order}</p>
                            <p>Berat: {product.weight}</p>
                            <p className="mb-3">Stock: {product.stock}</p>

                            <button className="px-4 py-3 rounded bg-primary text-white" onClick={handleAddToCartBtn}>
                                <FontAwesomeIcon icon="fa-solid fa-cart-shopping" className='mr-4' />
                                Tambah Ke Keranjang
                            </button>

                            <p className="text-lg font-semibold mb-3">Deskripsi:</p>
                            <p>{product?.description?.split('\n').map((line, index) => (
                                <React.Fragment key={index}>
                                    {line}
                                    <br />
                                </React.Fragment>
                            ))}</p>
                        </div>
                    </div>
                </Container>
            </Fade>
        </main>
    );
};

export default ProductLanding;