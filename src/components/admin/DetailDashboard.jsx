import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

import formatRupiah from "../../utilities/FormatRupiah";

const DetailDashboard = () => {
  const [detailOrder, setDetailOrder] = useState({});
  const { uuid } = useParams();
  const [isLoading, setIsLoading] = useState(true);

  const apiUrl = import.meta.env.VITE_API_URL;
  const storageUrl = import.meta.env.VITE_STORAGE_URL;

  const accessToken = localStorage.getItem("access_token");

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      await axios
        .get(`${apiUrl}/orders/${uuid}`)
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
        .put(`${apiUrl}/orders/${uuid}`, { status: newStatus })
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

  return (
    <div className="mx-auto min-h-screen max-w-md bg-[#F8F8FF] relative">
      {isLoading && (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center z-50 bg-white/70">
          <div className="loader "></div>
        </div>
      )}
      <div className="flex-1 relative px-6 pb-14">
        <div className="flex flex-col pt-8 pl-2">
          <h3 className="font-poppins font-bold text-3xl text-gray-700">
            Meja {detailOrder.meja}
          </h3>
          <h4 className="font-poppins font-bold text-2xl text-gray-700">
            Detail Pesanan
          </h4>
        </div>
        <div className="mt-4">
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
                  ? "bg-blue-500"
                  : "bg-gray-300"
              }`}
              onClick={() => handleStatus("diproses")}
              disabled={detailOrder.status === "diproses" || isLoading}
            >
              Diproses
            </button>
            <button
              className={`px-4 py-2 rounded-lg font-semibold text-gray-950 ${
                detailOrder.status === "selesai"
                  ? "bg-green-500"
                  : "bg-gray-300"
              }`}
              onClick={() => handleStatus("selesai")}
              disabled={detailOrder.status === "selesai" || isLoading}
            >
              Selesai
            </button>
          </div>
        </div>
        <div className="mt-6 px-2">
          {detailOrder.details && (
            <>
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
                        src={`${storageUrl}/${item.gambar}`}
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
                        src={`${storageUrl}/${item.gambar}`}
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
            </>
          )}
        </div>
        <div className="flex justify-between mt-8 px-2">
          <h3 className="font-poppins font-bold text-xl/10 text-gray-700">
            Total
          </h3>
          <h4 className="font-poppins font-bold text-2xl text-gray-700">
            {formatRupiah(detailOrder.total_harga ?? 0)}
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
  );
};

export default DetailDashboard;
