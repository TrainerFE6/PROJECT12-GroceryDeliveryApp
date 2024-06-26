import { Button, IconButton, Tooltip, useMediaQuery } from '@mui/material';
import { ArrowBack } from "@mui/icons-material";
import { checkoutContext } from '../../../pages/Landing/Cart';
import { useContext } from 'react';

const GoBackButton = () => {
    const [isProceedToCheckout, setIsProceedToCheckout] = useContext(checkoutContext);
    // Media Query
    const isSmallScreen = useMediaQuery('(min-width: 640px)');

    return (
        <Button
            color='success'
            onClick={() => setIsProceedToCheckout(!isProceedToCheckout)}
            size='small'
            sx={{textTransform: 'capitalize'}}
            variant='outlined'
            startIcon={<ArrowBack fontSize='inherit' />}>
            Kembali
        </Button>
    );
};

export default GoBackButton;