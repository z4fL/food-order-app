import { Cog8ToothIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const Dashboard = () => {
  const [orders, setOrders] = useState([]);

  const accessToken = localStorage.getItem("access_token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!accessToken) {
      navigate("/login");
    }

    const fetchDataOrder = async () => {
      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
      await axios.get("http://localhost:8000/api/orders").then((res) => {
        console.log(res);
        setOrders(res.data.data);
      });
    };

    fetchDataOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div className="mx-auto min-h-screen max-w-md bg-[#F8F8FF] relative">
        <div className="relative px-6 pb-12">
          <div className="flex justify-between items-center pt-10">
            <h3 className="font-poppins font-bold text-3xl text-gray-700">
              Dashboard
            </h3>
            <button className="p-2 cursor-pointer group">
              <Cog8ToothIcon className="w-10 h-10 text-gray-700 group-active:text-[#FF6D58]" />
            </button>
          </div>
          <h3 className="font-poppins font-medium text-2xl text-gray-700 mt-8">
            Daftar Order
          </h3>
          <div></div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
