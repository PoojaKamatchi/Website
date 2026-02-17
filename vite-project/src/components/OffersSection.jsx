import deliveryImg from "../assets/delivery.jpeg";

export default function OffersSection() {
  return (
    <section className="py-12 bg-yellow-100">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-center gap-8 px-6">

        {/* Image */}
        <img
          src={deliveryImg}
          alt="Free Delivery"
          className="w-64 h-64 object-cover rounded-xl shadow-lg"
        />

        {/* Text */}
        <div className="text-center md:text-left">
          <h2 className="text-3xl font-bold text-green-700 mb-3">
            🚚 Free Delivery
          </h2>

          <p className="text-lg font-semibold text-gray-700">
            Free Delivery inside Tamil Nadu
          </p>

          <p className="text-gray-600 mt-2">
            Fast • Safe • Reliable Delivery at your doorstep
          </p>
        </div>

      </div>
    </section>
  );
}
