import { Button, Container, useMediaQuery } from '@mui/material';
import { ArrowForward } from "@mui/icons-material";
import { Swiper, SwiperSlide} from "swiper/react";
import { FreeMode, Navigation, Pagination } from "swiper";
import meat from "../../../assets/categories/meat.png";
import vegetables from "../../../assets/categories/vagetable.png";
import fruits from "../../../assets/categories/fruits.png";
import dairy from "../../../assets/categories/dairy.png";
import grains from "../../../assets/categories/grains.png";
import "swiper/css";
import 'swiper/css/navigation';
import CategoryCard from '../../CategoryCard/CategoryCard';
import { useEffect, useRef, useState } from 'react';
import './swiper.css'
import { useNavigate } from 'react-router-dom';
import instance from '../../../https/core';
import { asset } from '../../../url';


const PopularCategories = () => {
    // Media Query
    const isExtraSmallScreen = useMediaQuery('(max-width: 664px)')
    const navigate = useNavigate();

    return (
        <Container>
            <section className='space-y-7'>
                <header className='flex justify-between items-center'>
                    {/* Title */}
                    <h1 className='pb-0 md:text-2xl text-xl font-semibold capitalize'>
                        Kategori Produk
                    </h1>
                    {/* See all Categories Btn */}
                    {/* <Button
                        size={isExtraSmallScreen ? 'small' : 'medium'}
                        color='success'
                        variant='outlined'
                        onClick={()=> navigate('/categories')}
                        sx={{ textTransform: 'capitalize' }} endIcon={
                            <ArrowForward fontSize='large' />}>
                        See All
                    </Button> */}
                </header>

                {/* Categories */}
                <Categories />
            </section>
        </Container>
    );
};

// Categories Carousel
const Categories = () => {
    const swiperRef = useRef(null);
    // media Quary
    const isExtraSmallScreen = useMediaQuery('(max-width: 640px)')

    const [data, setData] = useState([]);
    const colorList = [
        '#FEF4EA',
        '#F5F5F5',
        '#EAF5E3',
        '#eaf4f4',
        '#FAF9D7',
    ];

    const fetchData = async () => {
        try {
        console.log('get categories')
          const res = await instance.get('/categories/landing/list');
          setData(res.data.map((category) => {
            return {
                id: category.id,
                name: category.name,
                img: asset(category.path),
                bgColor: colorList[Math.floor(Math.random() * colorList.length)]
            }
          }));
        } catch (error) {
          console.log(error)
        }
    }

    useEffect(() => {
        if (data.length === 0) {
            fetchData()
        }
    });
    return (
        <Swiper
            breakpoints={
                {
                    // Extra_Small Screen
                    0: {
                        slidesPerView: 2,
                        spaceBetween: 20
                    },
                    //Medium Screen
                    768: {
                        slidesPerView: 3,
                        spaceBetween: 30
                    },
                    //Large Screen
                    1060: {
                        slidesPerView: 4,
                        spaceBetween: 25
                    }
                }
            }

            modules={[Pagination, Navigation, FreeMode]}
            navigation={!isExtraSmallScreen}
            freeMode={true}
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            className="mySwiper">
            {
                data.map(category => (
                    // Category_card 
                    <SwiperSlide key={category.id}>
                        <CategoryCard category={category} />
                    </SwiperSlide>
                ))
            }
        </Swiper>
    )
}
export default PopularCategories;