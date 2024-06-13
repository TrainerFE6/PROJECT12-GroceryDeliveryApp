import { Button, Container, Fade } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const EmptyCart = ({ isLoading, cartItems }) => {
    const navigate = useNavigate();
    React.useEffect(() => {
        console.log('here', isLoading, cartItems)
        window.scroll({ top: 0 });
    }, [isLoading, cartItems]);
    return (
        <Fade in={true}>
            <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <div className='text-center md:space-y-4 space-y-3.5 text-gray-500'>
                    {(!isLoading && cartItems.length === 0) && (
                        <>
                            <h6 className='text-sm'>Item tidak ditemukan</h6>
                            <Button
                                onClick={() => navigate('/products')}
                                size='large'
                                color='success'
                                sx={{ textTransform: 'capitalize' }}
                                variant='outlined'>
                                Lanjutkan Belanja
                            </Button>
                        </>
                    )}
                    {isLoading && (
                        <h6 className='text-sm'>Sedang Memuat Data ...</h6>
                    )}
                </div>
            </Container>
        </Fade>
    );
};

export default EmptyCart;