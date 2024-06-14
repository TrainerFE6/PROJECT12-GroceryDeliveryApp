import { Container, useMediaQuery } from '@mui/material';
import React from 'react';
import Logo_light from '../../assets/Logo_light.png';
import Facebook from '../../assets/icons/social_icons/Facebook.png';
import Instagram from '../../assets/icons/social_icons/Instagram.png';
import Twitter from '../../assets/icons/social_icons/Twitter.png';
import Linkedin from '../../assets/icons/social_icons/Linkedin.png';
import { LocationOn, Mail, Phone } from "@mui/icons-material";

// This Class for Sub_Component_Link
class Link {
    constructor(name, href) {
        this.name = name;
        this.href = href;
    }
}


const Footer = () => {
    // Media Query
    const isLargeScreen = useMediaQuery('(min-width:1024px)')

    return (
        <footer id='footer' className='text-white' style={{ backgroundColor: '#123F1E' }}>
            <Container sx={{ py: isLargeScreen ? 6.8 : 5 }}>
                <div className='flex justify-between sm:gap-x-2 lg:gap-x-0 gap-x-1.5 sm:gap-y-9 lg:gap-y-0 gap-y-7 justify-between'>

                    {/* About Grocery */}
                    <div className='col sm:col-span-2  lg:col-span-2 xl:space-y-6 space-y-4'>
                        {/* Brand_Logo */}
                        <img className='xl:h-7 sm:h-6 h-5' src={Logo_light} alt="grocery" />

                        {/* Description */}
                        <p className='sm:text-sm w-11/12 sm:w-10/12 text-xs tracking-wide'>
                        Kami menyediakan daging segar, sayuran, dan lainnya. Nikmati pengiriman cepat dan nikmati bahan-bahan terbaik untuk pengalaman makan yang lezat.
                        </p>
                    </div>
                </div>
            </Container>

            {/* Copyrights and Credit */}
            <div>
                <hr className='border-gray-600' />
                <div className='text-center flex items-center h-12'>
                    <span className='text-xs  w-full block text-gray-300 tracking-wider'>© 2024 Made with love</span>
                </div>
            </div>
        </footer>
    );
};

// This Sub_Component for footer links
const Links = ({ title, linksArray }) => (
    < div className='col xl:space-y-3.5 space-y-2'>
        {/* Title */}
        <h3 className='xl:text-xl sm:text-lg text-base font-semibold tracking-wider'>{title}</h3>

        {/* Links */}
        <div className='sm:space-y-2 space-y-1.5'>
            {
                linksArray.map((link, i) => (
                    <a key={i}
                        className='block xl:text-base text-sm hover:underline'
                        href={link.href || '#'}>
                        {link.name}
                    </a>
                ))
            }
        </div>
    </div >
)


export default Footer;