import { useLocation } from "react-router";
import dataProduct from "../data.json";

function formatUang(subject) {
  const rupiah = subject.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
  return `Rp${rupiah}`;
}

const DetailOrder = () => {
  const { state } = useLocation();

  const listOrder = state.order
    ? state.order.map((item) => {
        const product = dataProduct.find((p) => p.id === item.id);
        return {
          ...item,
          nama: product.nama,
          harga: product.harga,
          gambar: product.gambar,
          kategori: product.kategori,
          quantity: item.quantity,
          totalHarga: item.quantity * product.harga,
        };
      })
    : [];

  const totalHarga = listOrder.reduce((sum, item) => sum + item.totalHarga, 0);

  return (
    <div className="mx-auto min-h-screen max-w-md bg-[#F8F8FF] relative">
      <div className="flex-1 relative px-6 pb-14">
        <div className="flex flex-col pt-8 pl-4">
          <h3 className="font-poppins font-bold text-3xl text-gray-700">
            Meja 1
          </h3>
          <h4 className="font-poppins font-bold text-2xl text-gray-700">
            Detail Pesanan
          </h4>
        </div>
        <div className="mt-10 px-2">
          <div className="flex flex-col gap-5">
            {listOrder.map((item) => (
              <div key={item.nama} className="flex justify-start text-gray-700">
                <img
                  src={item.gambar}
                  alt={item.nama}
                  className="w-[130px] h-[130px] rounded-2xl"
                />
                <div className="grow flex flex-col font-poppins ml-5">
                  <p className="font-medium text-xl capitalize">{item.nama}</p>
                  <span className="mt-2.5 text-xl font-medium">
                    {item.quantity + " x " + item.harga}
                  </span>
                  <span className="mt-3 text-2xl font-bold">
                    {formatUang(item.totalHarga)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-between mt-8 px-6">
          <h3 className="font-poppins font-bold text-2xl/10 text-gray-700">
            Total
          </h3>
          <h4 className="font-poppins font-bold text-3xl text-gray-700">
            {formatUang(totalHarga)}
          </h4>
        </div>
        <div className="flex flex-col mt-8 pl-4 gap-4">
          <h3 className="font-poppins font-bold text-xl text-gray-700">
            Catatan
          </h3>
          <h4 className="font-poppins font-regular text-lg text-gray-700">
            tidak usah pake pake
          </h4>
        </div>
      </div>
    </div>
  );
};

export default DetailOrder;
