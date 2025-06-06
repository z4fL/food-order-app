import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (localStorage.getItem("access_token")) {
      navigate("/dashboard");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    await axios
      .post(apiUrl + "/login", formData)
      .then((res) => {
        localStorage.setItem("access_token", res.data.access_token);

        navigate("/dashboard");
      })
      .catch((error) => {
        const errorStatus = error.response.status;

        if (errorStatus == 401) {
          setError("Email atau Password salah!");
        } else {
          setError(error.response.statusText);
        }
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="mx-auto min-h-screen max-w-md md:max-w-3xl lg:max-w-5xl xl:max-w-6xl bg-[#F8F8FF] relative">
      <div className="relative mx-auto px-6 pb-14 max-w-md">
        <h3 className="pt-32 lg:pt-20 font-poppins font-bold text-3xl text-center text-gray-700">
          Login
        </h3>
        <div className="mt-8">
          {error.length != 0 && (
            <div
              className="p-4 mb-4 text-lg text-red-800 rounded-lg bg-red-50"
              role="alert"
            >
              {error}
            </div>
          )}

          <form
            onSubmit={handleLogin}
            className="flex flex-col justify-center font-poppins"
          >
            <div className="mb-5">
              <label
                htmlFor="email"
                className="block mb-2 text-lg font-medium text-gray-900"
              >
                Your email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:outline focus:outline-[#FF6D58] focus:border-[#FF6D58] block w-full p-2.5"
                required
              />
            </div>
            <div className="mb-5">
              <label
                htmlFor="password"
                className="block mb-2 text-lg font-medium text-gray-900"
              >
                Your password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:outline focus:outline-[#FF6D58] focus:border-[#FF6D58] block w-full p-2.5"
                required
              />
            </div>
            <button
              type="submit"
              className="text-white bg-[#FF6D58] hover:bg-[#ff6e58de] focus:ring-4 focus:outline-none focus:ring-[#ffafa2] font-medium rounded-lg text-xl w-full px-5 py-2.5 text-center"
            >
              {isLoading ? (
                <svg
                  className="mx-auto size-7 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                "Submit"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
