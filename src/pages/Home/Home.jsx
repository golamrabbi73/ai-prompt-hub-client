import Banner from "../../components/home/Banner";
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
    </div>
  );
};

export default Home;