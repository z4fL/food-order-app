import { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";

import SplashScreen from "./SplashScreen";
import formatRupiah from "../utilities/FormatRupiah";
import Pusher from "pusher-js";

const DetailOrder = () => {
  const [detailOrder, setDetailOrder] = useState({});
  const { uuid } = useParams();
  const [showSplashScreen, setshowSplashScreen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [statusOrder, setStatusOrder] = useState("");

  const apiUrl = import.meta.env.VITE_API_URL;
  const pusherKey = import.meta.env.VITE_PUSHER_APP_KEY;
  const pusherCluster = import.meta.env.VITE_PUSHER_CLUSTER;

  const fetchData = async () => {
    await axios
      .get(`${apiUrl}/orders/${uuid}`, {
        headers: { "ngrok-skip-browser-warning": "1" },
      })
      .then((res) => {
        console.log(res.data.data);
        setDetailOrder(res.data.data);
        setStatusOrder(res.data.data.status);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => setshowSplashScreen(false));
  };

  useEffect(() => {
    setshowSplashScreen(true);

    const pusher = new Pusher(pusherKey, {
      cluster: pusherCluster,
    });

    const channel = pusher.subscribe("orders");
    channel.bind("order.updated", function (data) {
      setStatusOrder(data.order.status);
    });

    fetchData();

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (showSplashScreen) {
    return <SplashScreen />;
  }

  // Helper to get color based on status
  const getStatusColor = (status) => {
    switch (status) {
      case "belum dibayar":
        return "bg-yellow-400";
      case "diproses":
        return "bg-blue-400";
      case "diantar":
        return "bg-green-400";
      default:
        return "bg-gray-300";
    }
  };

  const payNow = async () => {
    setIsLoading(true);
    await axios
      .post(`${apiUrl}/pay-order/${uuid}`, {
        headers: { "ngrok-skip-browser-warning": "1" },
      })
      .then((res) => {
        window.location.href = res.data.checkout_link;
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="mx-auto min-h-screen max-w-md md:max-w-3xl lg:max-w-5xl xl:max-w-6xl bg-[#F8F8FF] relative">
      <div className="flex-1 relative px-6 pb-14">
        <div className="flex flex-col pt-8 pl-2">
          <h3 className="font-poppins font-bold text-3xl text-gray-700">
            Meja {detailOrder.meja}
          </h3>
          <h4 className="font-poppins font-bold text-2xl text-gray-700">
            Detail Pesanan
          </h4>
        </div>

        <div className="py-6 pl-2 flex items-center gap-3">
          <span className="font-poppins font-medium text-xl text-gray-700">
            Status :{" "}
          </span>
          <div className="flex gap-2 font-poppins">
            <button
              className={`px-4 py-2 rounded-lg font-semibold text-gray-950 ${getStatusColor(
                statusOrder
              )}`}
            >
              {statusOrder === "belum dibayar"
                ? "Belum Dibayar"
                : statusOrder === "diproses"
                ? "Diproses"
                : statusOrder === "diantar"
                ? "Diantar"
                : "Unknown"}
            </button>
          </div>
        </div>
        <div className="flex justify-between">
          {detailOrder.details && (
            <div className="flex flex-col md:flex-row gap-10 lg:gap-4">
              <div className="">
                <h5 className="font-poppins font-medium text-2xl text-gray-700 mb-2">
                  Makanan
                </h5>
                <div className="flex flex-col gap-5">
                  {detailOrder.details
                    .filter((item) => item.kategori === "makanan")
                    .map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-start items-center text-gray-700"
                      >
                        <img
                          src={item.gambar}
                          alt={item.nama_produk}
                          className="w-[110px] h-[110px] rounded-2xl"
                        />
                        <div className="grow flex flex-col font-poppins ml-5">
                          <p className="font-medium text-base capitalize">
                            {item.nama_produk}
                          </p>
                          <span className="mt-1 text-lg font-medium">
                            {item.qty + " x " + item.harga_produk}
                          </span>
                          <span className="mt-2 text-xl font-bold">
                            {formatRupiah(item.total_harga)}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
              <div className="">
                <h5 className="font-poppins font-medium text-2xl text-gray-700 mb-2">
                  Minuman
                </h5>
                <div className="flex flex-col gap-5">
                  {detailOrder.details
                    .filter((item) => item.kategori === "minuman")
                    .map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-start items-center text-gray-700"
                      >
                        <img
                          src={item.gambar}
                          alt={item.nama_produk}
                          className="w-[110px] h-[110px] rounded-2xl"
                        />
                        <div className="grow flex flex-col font-poppins ml-5">
                          <p className="font-medium text-base capitalize">
                            {item.nama_produk}
                          </p>
                          <span className="mt-1 text-lg font-medium">
                            {item.qty + " x " + item.harga_produk}
                          </span>
                          <span className="mt-2 text-xl font-bold">
                            {formatRupiah(item.total_harga)}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
          <div className="hidden lg:flex flex-col p-4 bg-white rounded-lg shadow-lg">
            <div className="flex gap-32 mt-4 px-2">
              <h3 className="font-poppins font-bold text-xl/10 text-gray-700">
                Total
              </h3>
              <h4 className="font-poppins font-bold text-2xl text-gray-700">
                {formatRupiah(detailOrder.total_harga)}
              </h4>
            </div>
            <div className="flex flex-col mt-4 gap-4">
              <h3 className="font-poppins font-bold text-xl text-gray-700">
                Catatan
              </h3>
              <h4 className="font-poppins font-regular text-lg text-gray-700">
                {!detailOrder.catatan && "-"}
              </h4>
            </div>
          </div>
        </div>
        <div className="lg:hidden">
          <div className="flex justify-between mt-8 px-2">
            <h3 className="font-poppins font-bold text-xl/10 text-gray-700">
              Total
            </h3>
            <h4 className="font-poppins font-bold text-2xl text-gray-700">
              {formatRupiah(detailOrder.total_harga ?? 0)}
            </h4>
          </div>
          <div className="flex flex-col mt-4 mb-20 gap-4">
            <h3 className="font-poppins font-bold text-xl text-gray-700">
              Catatan
            </h3>
            <h4 className="font-poppins font-regular text-lg text-gray-700">
              {!detailOrder.catatan && "-"}
            </h4>
          </div>
        </div>
      </div>
      {statusOrder == "belum dibayar" && (
        <div className="fixed right-6 bottom-10 z-20 flex flex-col items-end mt-10">
          <button
            onClick={() => payNow()}
            disabled={isLoading}
            className="py-3 px-4 bg-[#FF6D58] rounded-lg cursor-pointer group disabled:bg-[#b97267] font-poppins font-semibold text-lg text-gray-950 disabled:hover:text-white"
          >
            Bayar Sekarang
          </button>
        </div>
      )}
    </div>
  );
};

export default DetailOrder;
