import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";

import formatRupiah from "../../utilities/FormatRupiah";

const DetailDashboard = () => {
  const [detailOrder, setDetailOrder] = useState({});
  const { uuid } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const apiUrl = import.meta.env.VITE_API_URL;
  const accessToken = localStorage.getItem("access_token");

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      await axios
        .get(`${apiUrl}/orders/${uuid}`, {
          headers: { "ngrok-skip-browser-warning": "1" },
        })
        .then((res) => {
          setDetailOrder(res.data.data);
        })
        .finally(() => {
          setIsLoading(false);
        });
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStatus = async (newStatus) => {
    try {
      setIsLoading(true);
      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
      await axios
        .put(
          `${apiUrl}/orders/${uuid}`,
          { status: newStatus },
          { headers: { "ngrok-skip-browser-warning": "1" } }
        )
        .then((res) => {
          console.log(res.data);
        });
      setDetailOrder((prev) => ({ ...prev, status: newStatus }));
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="mx-auto min-h-screen max-w-md md:max-w-3xl lg:max-w-5xl xl:max-w-6xl bg-[#F8F8FF] relative">
      {isLoading && (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center z-50 bg-white/70">
          <div className="loader "></div>
        </div>
      )}
      <div className="flex-1 relative px-6 pb-14">
        <div className="flex pt-8">
          <button className="cursor-pointer" onClick={handleBack}>
            <ChevronLeftIcon className="w-8 h-8 text-gray-700" />
          </button>
          <div className="flex flex-col pl-5">
            <h3 className="font-poppins font-bold text-3xl text-gray-700">
              Meja {detailOrder.meja}
            </h3>
            <h4 className="font-poppins font-bold text-2xl text-gray-700">
              Detail Pesanan
            </h4>
          </div>
        </div>
        <div className="my-6">
          <div className="flex gap-2 font-poppins">
            <button
              className={`px-4 py-2 rounded-lg font-semibold text-gray-950 ${
                detailOrder.status === "pending"
                  ? "bg-yellow-400"
                  : "bg-gray-300"
              }`}
              disabled={detailOrder.status === "pending" || isLoading}
            >
              Pending
            </button>
            <button
              className={`px-4 py-2 rounded-lg font-semibold text-gray-950 ${
                detailOrder.status === "diproses"
                  ? "bg-blue-400"
                  : "bg-gray-300"
              }`}
              onClick={() => handleStatus("diproses")}
              disabled={detailOrder.status === "diproses" || isLoading}
            >
              Diproses
            </button>
            <button
              className={`px-4 py-2 rounded-lg font-semibold text-gray-950 ${
                detailOrder.status === "diantar"
                  ? "bg-green-400"
                  : "bg-gray-300"
              }`}
              onClick={() => handleStatus("diantar")}
              disabled={detailOrder.status === "diantar" || isLoading}
            >
              Diantar
            </button>
          </div>
        </div>
        <div className="flex justify-between">
          {detailOrder.details && (
            <div className="px-2 flex flex-col md:flex-row gap-10">
              <div className="">
                <h5 className="font-poppins font-medium text-2xl text-gray-700 mb-2">
                  Makanan
                </h5>
                <div className="flex flex-col gap-5 mb-6">
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
          <div className="hidden lg:flex flex-col">
            <div className="flex gap-40 mt-8 px-2">
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
        <div className="lg:hidden flex justify-between mt-8 px-2">
          <h3 className="font-poppins font-bold text-xl/10 text-gray-700">
            Total
          </h3>
          <h4 className="font-poppins font-bold text-2xl text-gray-700">
            {formatRupiah(detailOrder.total_harga ?? 0)}
          </h4>
        </div>
        <div className="lg:hidden flex flex-col mt-4 gap-4">
          <h3 className="font-poppins font-bold text-xl text-gray-700">
            Catatan
          </h3>
          <h4 className="font-poppins font-regular text-lg text-gray-700">
            {!detailOrder.catatan && "-"}
          </h4>
        </div>
      </div>
    </div>
  );
};

export default DetailDashboard;
