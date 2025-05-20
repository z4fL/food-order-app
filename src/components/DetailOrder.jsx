import { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";

import SplashScreen from "./SplashScreen";

function formatUang(subject) {
  const rupiah = subject.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
  return `Rp${rupiah}`;
}

const DetailOrder = () => {
  const [detailOrder, setDetailOrder] = useState({});
  const { uuid } = useParams();
  const [isLoading, setIsLoading] = useState(true);

  const apiUrl = import.meta.env.VITE_API_URL;
  const storageUrl = import.meta.env.VITE_STORAGE_URL;

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      await axios
        .get(`${apiUrl}/orders/${uuid}`)
        .then((res) => {
          console.log(res.data.data);
          setDetailOrder(res.data.data);
          setIsLoading(false);
        });
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <div className="mx-auto min-h-screen max-w-md bg-[#F8F8FF] relative">
      <div className="flex-1 relative px-6 pb-14">
        <div className="flex flex-col pt-8 pl-2">
          <h3 className="font-poppins font-bold text-3xl text-gray-700">
            Meja {detailOrder.meja}
          </h3>
          <h4 className="font-poppins font-bold text-2xl text-gray-700">
            Detail Pesanan
          </h4>
        </div>
        <div className="mt-10 px-2">
          <div className="flex flex-col gap-5">
            {detailOrder.details.map((item) => (
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
                    {formatUang(item.total_harga)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-between mt-8 px-2">
          <h3 className="font-poppins font-bold text-xl/10 text-gray-700">
            Total
          </h3>
          <h4 className="font-poppins font-bold text-2xl text-gray-700">
            {formatUang(detailOrder.total_harga)}
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

export default DetailOrder;
