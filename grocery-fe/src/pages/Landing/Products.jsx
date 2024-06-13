import { Container, Fade } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import ProductCard, { ProductCardSkeleton } from '../../Components/Products/ProductCard/ProductCard';
import { useParams, useSearchParams } from 'react-router-dom';
import instance from '../../https/core';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { categoryName } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();

    // Scrolling Bug Fixed
    window.scroll({ top: 0 });

    const getData = async function () {
        try {
            const res = await instance.get('products/landing/list', {
                params: {
                    category_id: searchParams.get('category_id')
                }
            });
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
            
            setProducts(products)
            setIsLoading(!isLoading)
        }
        catch (error) {
            throw new Error('Products Fetch Failed', error)
        }
    };

    // Get Products 
    useEffect(() => {
        getData();
    }, [])

    return (
        <main className='min-h-screen space-y-5 pt-20 mb-9'>
            <Fade in={true}>
                <Container className='xl:space-y-10 sm:space-y-8 space-y-6'>
                    {/* Title */}
                    <h1 className='pb-0 md:text-2xl text-xl font-semibold text-gray-700 capitalize'>
                        {categoryName ? categoryName : 'All Products'}
                    </h1>

                    {/* Product_cards*/}
                    <section className='grid xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 lg:gap-6 gap-x-5 gap-y-5'>
                        {
                            !isLoading ?
                                products.map(product => (
                                    <ProductCard
                                        key={product.id}
                                        product={product} />
                                ))
                                : Array.from({ length: 8 }).map((pd, i) => {
                                    return <ProductCardSkeleton key={i} />
                                })
                        }
                    </section>
                </Container>
            </Fade>
        </main>
    );
};

export default Products;