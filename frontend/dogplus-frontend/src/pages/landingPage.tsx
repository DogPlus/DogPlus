import { Link } from "react-router-dom";
import "../styles/DogAnimation.css";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <video
          autoPlay
          loop
          muted
          className="w-full h-full object-cover"
          style={{ filter: "brightness(50%)" }}
        >
          <source src="/path/to/your/video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      <div className="z-10 text-center p-4 flex flex-col items-center">
        <div className="animation-container">
          <div className="dog">
            <div className="dog-torso"></div>
            <div className="dog-head">
              <div className="dog-ear dog-ear-left"></div>
              <div className="dog-ear dog-ear-right"></div>
              <div className="dog-eye dog-eye-left"></div>
              <div className="dog-eye dog-eye-right"></div>
              <div className="dog-nose"></div>
            </div>
            <div className="dog-leg dog-leg-front dog-leg-left"></div>
            <div className="dog-leg dog-leg-front dog-leg-right"></div>
            <div className="dog-leg dog-leg-back dog-leg-left"></div>
            <div className="dog-leg dog-leg-back dog-leg-right"></div>
            <div className="dog-tail"></div>
          </div>
          <div className="ball"></div>
        </div>
        <div className="flex items-center">
          <h1 className="text-4xl font-bold text-brown-900">
            Welcome to DogPlus
          </h1>
          <img
            src="./assets/icons/dogpluslogo.jpg"
            alt="Dog Plus Logo"
            className="max-h-16"
          />
        </div>

        <div className="flex flex-col space-y-4 mt-6">
          <Link
            to="/auth"
            className="text-lg px-6 py-3 bg-accent-0 hover:bg-accent-100 text-white font-bold rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out"
          >
            Log In
          </Link>
          <Link
            to="/register"
            className="text-lg px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
