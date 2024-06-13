import { Fade } from '@mui/material';
import CustomersReview from '../../Components/Home/CustomersReview/CustomersReview';
import DownloadOurApp from '../../Components/Home/DownloadOurApp/DownloadOurApp';
import Hero from '../../Components/Home/Hero/Hero';
import OurBestQualities from '../../Components/Home/OurBestQualities/OurBestQualities';
import OurServices from '../../Components/Home/OurServices/OurServices';
import PopularCategories from '../../Components/Home/PopularCategories/PopularCategories';
import EnjoyOurFreshGroceryItems from '../../Components/Home/EnjoyOurFreshGroceryItems/EnjoyOurFreshGroceryItems';

const Home = () => {
  // Scrolling Bug Fixed
  window.scroll({ top: 0 });

  return (
    <Fade in={true}>
      <main className='min-h-screen space-y-5 mb-9'>
        <Hero />
        <PopularCategories />
        <OurBestQualities />
        <EnjoyOurFreshGroceryItems />
        <OurServices />
      </main>
    </Fade>
  )
};

export default Home;