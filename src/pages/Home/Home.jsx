import Banner from "../../components/home/Banner";
import CustomerReviews from "../../components/home/CustomerReviews";
import FeaturedPrompts from "../../components/home/FeaturedPrompts";
import HowItWorks from "../../components/home/HowItWorks";
import TopCreators from "../../components/home/TopCreators";
import WhyChooseUs from "../../components/home/WhyChooseUs";

const Home = () => {
  return (
    <div>
      <Banner />
      <FeaturedPrompts />
      <WhyChooseUs />
      <TopCreators />
      <CustomerReviews />
      <HowItWorks />
    </div>
  );
};

export default Home;