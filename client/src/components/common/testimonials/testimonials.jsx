import React from "react";

const Testimonials = () => {
  const reviews = [
    {
      id: 1,
      name: "Sophia Roberts",
      image: "https://i.pravatar.cc/120?img=32",
      text: "The quality of the forged steel knives is unmatched. They feel balanced and professional in my hand.",
      rating: 5,
    },
    {
      id: 2,
      name: "Daniel Tesfaye",
      image: "https://i.pravatar.cc/120?img=12",
      text: "I bought the complete dining set. The minimalist design perfectly matches my modern kitchen aesthetic.",
      rating: 5,
    },
    {
      id: 3,
      name: "Elena G.",
      image: "https://i.pravatar.cc/120?img=45",
      text: "Customer service helped me pick the right blender. It arrived in two days. Highly recommended!",
      rating: 5,
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-[#2d6a6a] text-white">
      <div className="max-w-screen-2xl mx-auto px-6 md:px-10">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight">
            What our customers say
          </h2>
          <p className="mt-3 text-white/80 text-sm md:text-base max-w-2xl mx-auto">
            Real feedback from home cooks who upgraded their everyday tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white text-gray-800 rounded-2xl p-8 shadow-lg flex flex-col items-center text-center"
            >
              <div className="flex text-amber-400 mb-5 space-x-0.5">
                {[...Array(review.rating)].map((_, i) => (
                  <span key={i} className="text-lg" aria-hidden>
                    ★
                  </span>
                ))}
              </div>
              <p className="text-gray-600 italic leading-relaxed mb-8 text-sm md:text-base flex-1">
                “{review.text}”
              </p>
              <div className="mt-auto flex flex-col items-center">
                <div className="w-14 h-14 rounded-full overflow-hidden mb-3 ring-2 ring-[#e6f4f2]">
                  <img src={review.image} alt="" className="w-full h-full object-cover" />
                </div>
                <h4 className="font-bold text-gray-900 text-xs uppercase tracking-widest">{review.name}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
