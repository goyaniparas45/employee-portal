import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div className="grid h-screen w-full place-content-center bg-white px-4">
      <img src="images/401.svg" alt="401" className="w-[512px]" />
      <div className="text-center mt-12 ">
        <Link to="/login">
          <span className="text-blue-900 font-semibold underline">Dashboard</span>
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
