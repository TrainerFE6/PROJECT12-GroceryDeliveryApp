import { Button, Container, useMediaQuery } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import ProductCard, { ProductCardSkeleton } from '../../Products/ProductCard/ProductCard';
import { useNavigate } from 'react-router-dom';
import { products } from '../../../store/products';
import instance from '../../../https/core';

const EnjoyOurFreshGroceryItems = () => {
    const [items, setItems] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    // MediaQuery
    const isExtraSmallScreen = useMediaQuery('(max-width: 640px)');

    // Get Grocery Items
    const getData = async () => {
        try {
            setIsLoading(true);
            const res = await instance.get('products/landing/list');
            const products = res.data.map((x) => {
                return {
                    id: x.id,
                    name: x.name,
                    Category: x.Category,
                    ProductImages: x.ProductImages,
                    sku: x.sku,
                    description: x.description,
                    min_order: x.min_order,
                    weight: x.weight,
                    price: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(x.price) || '-',
                    stock: x.stock,
                    quantity: x.min_order,
                }
            })
            setItems(products.slice(0, 3))
            setIsLoading(false)

        } catch (error) {
            // throw new Error('EnjoyFreshItems Fetch Failed', error)
        }
    };

    useEffect(() => {
        getData();
    }, [])

    return (
        <Container >
            <div className='space-y-7 xl:space-y-8'>
                {/* Title */}
                <h1 className='text-center pb-0 md:text-2xl text-xl font-semibold capitalize tracking-wide'>
                    Nikmati Barang yang Segar dan Murah <br />
                    Barang Kami
                </h1>

                {/*Grocery Items */}
                <div className='grid md:grid-cols-3 sm:grid-cols-2 
                lg:gap-6 gap-x-5 gap-y-5'>
                    {!isLoading ?
                        items.map(item => (
                            <ProductCard key={item.id}
                                product={item} />
                        ))
                        : Array.from({ length: 3 }).map((pd, i) => {
                            return <ProductCardSkeleton key={i} />
                        })
                    }
                </div>
                <Button
                    onClick={() => navigate('/products')}
                    color='success'
                    size={isExtraSmallScreen ? 'small' : 'medium'}
                    variant='outlined'
                    sx={{ textTransform: 'capitalize', display: 'block', mx: 'auto' }}>
                    Lihat Semua Produk
                </Button>
            </div>
        </Container>
    );
};

export default EnjoyOurFreshGroceryItems;