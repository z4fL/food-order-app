import { Cog8ToothIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import dataProduk from '../../data.json'

function formatUang(subject) {
  const rupiah = subject.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
  return `Rp${rupiah}`;
}

const Dashboard = () => {
  const [orders, setOrders] = useState([]);

  const accessToken = localStorage.getItem("access_token");
  const navigate = useNavigate();

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!accessToken) {
      navigate("/login");
    }

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

    fetchDataOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Group order details by kategori from dataProduk
  const groupedDetailsByKategori = {};

  orders.forEach(order => {
    order.details.forEach(detail => {
      const produk = dataProduk.find(p => p.id === detail.id_produk);
      if (produk) {
        const kategori = produk.kategori;
        if (!groupedDetailsByKategori[kategori]) {
          groupedDetailsByKategori[kategori] = [];
        }
        groupedDetailsByKategori[kategori].push({
          ...detail,
          nama_produk: produk.nama_produk,
          kategori,
        });
      }
    });
  });

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
          <div className="mt-6">
            {orders.map((item) => (
              <div
                key={item.id}
                className="flex flex-col p-4 rounded-xl bg-white shadow"
              >
                <div className="mb-3">
                  <h3 className="mb-1 font-poppins font-medium text-xl text-gray-700">
                    Meja {item.meja}
                  </h3>
                  <h4 className="font-poppins font-medium text-lg text-gray-700">
                    Total Harga {formatUang(item.total_harga)}
                  </h4>
                </div>
                <div className="flex flex-col gap-5">
                  {item.details.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-start items-center text-gray-700"
                    >
                      <div className="grow flex flex-col font-poppins">
                        <p className="font-medium text-base capitalize">
                          {item.qty + " x " + item.nama_produk}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
