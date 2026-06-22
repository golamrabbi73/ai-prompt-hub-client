import Banner from "../../components/home/Banner";
import CustomerReviews from "../../components/home/CustomerReviews";
import FeaturedPrompts from "../../components/home/FeaturedPrompts";
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
    </div>
  );
};

export default Home;