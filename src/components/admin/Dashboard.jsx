import { Cog8ToothIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import Pusher from "pusher-js";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

function formatUang(subject) {
  const rupiah = subject.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
  return `Rp${rupiah}`;
}

const Dashboard = () => {
  const [orders, setOrders] = useState([]);

  const accessToken = localStorage.getItem("access_token");
  const navigate = useNavigate();

  const apiUrl = import.meta.env.VITE_API_URL;
  const pusherKey = import.meta.env.VITE_PUSHER_APP_KEY;
  const pusherCluster = import.meta.env.VITE_PUSHER_CLUSTER;

  const fetchDataOrder = async () => {
    axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    try {
      const res = await axios.get(apiUrl + "/orders");
      setOrders(res.data.data);
      console.log(res.data.data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("access_token");
        navigate("/login");
      } else {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    if (!accessToken) {
      navigate("/login");
    }

    const pusher = new Pusher(pusherKey, {
      cluster: pusherCluster,
    });

    const channel = pusher.subscribe("orders");
    channel.bind("order.created", function (data) {
      console.log("ada order baru!");
      setOrders((prev) => [data.order, ...prev]);
    });

    fetchDataOrder();

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClickOrder = (uuid) => {
    navigate(`/dashboard/${uuid}`);
  };

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
          <div className="">
            {orders.map((item) => {
              const makanan = item.details.filter(
                (d) => d.kategori === "makanan"
              );
              const minuman = item.details.filter(
                (d) => d.kategori === "minuman"
              );
              return (
                <div
                  key={item.id}
                  className="flex flex-col mt-6 p-4 rounded-xl bg-white shadow"
                  onClick={() => handleClickOrder(item.uuid)}
                >
                  <div className="mb-3">
                    <h3 className="mb-1 font-poppins font-bold text-xl text-gray-700">
                      Meja {item.meja}
                    </h3>
                    <h4 className="font-poppins font-medium text-lg text-gray-700">
                      Total Harga {formatUang(item.total_harga)}
                    </h4>
                  </div>
                  <div>
                    <div className="font-poppins font-semibold">Makanan</div>
                    <div className="flex flex-col gap-2 mb-4">
                      {makanan.length > 0 ? (
                        makanan.map((d) => (
                          <p
                            key={d.id}
                            className="text-gray-700 font-poppins font-medium text-base capitalize"
                          >
                            {d.qty + " x " + d.nama_produk}
                          </p>
                        ))
                      ) : (
                        <div className="font-poppins text-gray-400 text-sm">
                          Tidak ada makanan
                        </div>
                      )}
                    </div>
                    <div className="font-poppins font-semibold">Minuman</div>
                    <div className="flex flex-col gap-2">
                      {minuman.length > 0 ? (
                        minuman.map((d) => (
                          <p
                            key={d.id}
                            className="text-gray-700 font-poppins font-medium text-base capitalize"
                          >
                            {d.qty + " x " + d.nama_produk}
                          </p>
                        ))
                      ) : (
                        <div className="font-poppins text-gray-400 text-sm">
                          Tidak ada minuman
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
