import HomePageNav from "./HomePageNav";
import Navbar from "./NavBar";
import Grid from "./Grid";

function HomePageParent() {
  return (
    <>
      <div>
        <Navbar />
        <HomePageNav />
        <Grid />
      </div>
    </>
  );
}

export default HomePageParent;
