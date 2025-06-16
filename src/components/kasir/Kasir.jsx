import { Cog8ToothIcon, XMarkIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import Pusher from "pusher-js";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import formatRupiah from "../../utilities/FormatRupiah";
import Loader from "../Loader";

const Kasir = () => {
  const [orders, setOrders] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [heldOrder, setHeldOrder] = useState(null);
  const holdTimeout = useRef();
  const [isLoading, setIsLoading] = useState(false);

  const accessToken = localStorage.getItem("access_token");
  const navigate = useNavigate();

  const apiUrl = import.meta.env.VITE_API_URL;
  const pusherKey = import.meta.env.VITE_PUSHER_APP_KEY;
  const pusherCluster = import.meta.env.VITE_PUSHER_CLUSTER;

  const fetchDataOrder = async () => {
    axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    try {
      const res = await axios.get(apiUrl + "/orders/cashier", {
        headers: { "ngrok-skip-browser-warning": "1" },
      });
      setOrders(res.data.data);
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
    const pusher = new Pusher(pusherKey, {
      cluster: pusherCluster,
    });

    const channel = pusher.subscribe("orders");
    channel.bind("order.created", function (data) {
      setOrders((prev) => [data.order, ...prev]);
    });

    fetchDataOrder();

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleHoldStart = (order) => {
    holdTimeout.current = setTimeout(() => {
      setHeldOrder(order);
    }, 1000);
  };

  const handleHoldEnd = () => {
    clearTimeout(holdTimeout.current);
  };

  const handleClosePopup = () => {
    setHeldOrder(null);
  };

  const handleLogout = () => {
    axios
      .post(
        `${apiUrl}/logout`,
        {},
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      )
      .catch((err) => {
        console.log(err);
      });
    localStorage.removeItem("access_token");
    navigate("/login");
  };

  const payOrder = async (uuid) => {
    try {
      setIsLoading(true);
      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
      await axios
        .put(
          `${apiUrl}/orders/${uuid}`,
          { status: "diproses" },
          { headers: { "ngrok-skip-browser-warning": "1" } }
        )
        .then((res) => {
          console.log(res.data);
        });
      setOrders((prev) => prev.filter((order) => order.uuid !== uuid));
      handleClosePopup();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="mx-auto min-h-screen max-w-md md:max-w-3xl lg:max-w-5xl xl:max-w-6xl bg-[#F8F8FF] relative">
        <div className="relative px-6 pb-12">
          <div className="flex justify-between items-center pt-10">
            <h3 className="font-poppins font-bold text-3xl text-gray-700">
              Kasir
            </h3>
            <div className="relative">
              <button className="p-2 cursor-pointer group">
                <Cog8ToothIcon
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  className="w-10 h-10 text-gray-700 group-active:text-[#FF6D58]"
                />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg font-poppins z-10">
                  <button
                    className="block w-full text-lg text-left px-5 py-3 text-gray-700 hover:bg-gray-100"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
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
                  className="mx-auto flex flex-col mt-6 p-4 max-w-md md:max-w-lg lg:max-w-xl rounded-xl bg-white shadow"
                  onMouseDown={() => handleHoldStart(item)}
                  onMouseUp={handleHoldEnd}
                  onMouseLeave={handleHoldEnd}
                  onTouchStart={() => handleHoldStart(item)}
                  onTouchEnd={handleHoldEnd}
                >
                  <div className="mb-3">
                    <h3 className="mb-1 font-poppins font-bold text-xl lg:text-2xl text-gray-700 capitalize">
                      Meja {item.meja} | {item.status}
                    </h3>
                    <h4 className="font-poppins font-medium text-lg text-gray-700">
                      Total Harga {formatRupiah(item.total_harga)}
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
          {heldOrder && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full relative">
                <button
                  className="absolute top-5 right-5 text-gray-700 hover:text-red-500"
                  onClick={handleClosePopup}
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
                <div className="mb-3">
                  <h3 className="mb-1 font-poppins font-bold text-xl lg:text-2xl text-gray-700 capitalize">
                    Meja {heldOrder.meja} | {heldOrder.status}
                  </h3>
                  <h4 className="font-poppins font-medium text-lg text-gray-700">
                    Total Harga {formatRupiah(heldOrder.total_harga)}
                  </h4>
                </div>
                <div>
                  <div className="font-poppins font-semibold">Makanan</div>
                  <div className="flex flex-col gap-2 mb-4">
                    {heldOrder.details.filter((d) => d.kategori === "makanan")
                      .length > 0 ? (
                      heldOrder.details
                        .filter((d) => d.kategori === "makanan")
                        .map((d) => (
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
                    {heldOrder.details.filter((d) => d.kategori === "minuman")
                      .length > 0 ? (
                      heldOrder.details
                        .filter((d) => d.kategori === "minuman")
                        .map((d) => (
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
                <div className="mt-3">
                  <div className="flex justify-end items-center">
                    <button
                      onClick={() => payOrder(heldOrder.uuid)}
                      className="bg-green-600 hover:bg-green-600 focus:outline-2 focus:outline-offset-2 focus:outline-green-500 active:bg-green-700 text-white font-poppins font-semibold px-6 py-2 rounded-lg text-center"
                    >
                      {isLoading ? <Loader /> : "Submit"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Kasir;
