const QuoteSection = () => {
  return (
    <section className="py-20 px-6 bg-warm-charcoal">
      <div className="max-w-[900px] mx-auto text-center">
        <div className="mb-6">
          <svg
            className="w-12 h-12 mx-auto text-terracotta/40"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M3 21c3 0 7-1 7-8V5c0-1.25-4.5-5-7-5S0 3.75 0 5v10c0 7 4 8 7 8zm14 0c3 0 7-1 7-8V5c0-1.25-4.5-5-7-5s-7 3.75-7 5v10c0 7 4 8 7 8z" />
          </svg>
        </div>

        <h2 className="heading-display text-warm-canvas text-[32px] md:text-[40px] italic mb-6 leading-relaxed">
          "To travel is to awaken the soul. In the wilderness, we find not just wildlife, but ourselves."
        </h2>

        <p className="font-sub font-light text-warm-canvas/70 text-[14px]">
          Every safari is a journey inward, where the rhythm of nature guides us home.
        </p>
      </div>
    </section>
  );
};

export default QuoteSection;
