import { useState } from "react";
import { subscribeNewsletter } from "@/services/publicApi";

const NewsletterSection = () => {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterName, setNewsletterName] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscribeSuccess, setSubscribeSuccess] = useState(false);
  const [subscribeError, setSubscribeError] = useState<string | null>(null);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setIsSubscribing(true);
    setSubscribeError(null);
    try {
      await subscribeNewsletter({
        email: newsletterEmail.trim(),
        name: newsletterName.trim() || undefined,
      });
      setSubscribeSuccess(true);
      setNewsletterEmail("");
      setNewsletterName("");
    } catch (err: any) {
      setSubscribeError(err.message || "Failed to subscribe. Please try again.");
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <section className="section-dark noise-overlay relative bg-warm-charcoal/10">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="heading-display text-warm-charcoal text-[36px] md:text-[48px] leading-tight mb-6">
              Stay Wild
            </h2>
            <p className="body-text text-warm-charcoal/60 text-[16px] leading-relaxed max-w-lg">
              Join our monthly newsletter for exclusive safari stories, conservation updates, and early access to new expedition routes. 
              Delivered straight to your inbox with no spam—just pure wilderness inspiration.
            </p>
            <div className="mt-8 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center">
                <span className="text-gold text-[12px] font-sub">✓</span>
              </div>
              <p className="font-sub font-light text-warm-charcoal/50 text-[14px]">
                <span className="text-gold">1,247+</span> subscribers already exploring with us
              </p>
            </div>
          </div>
          <div>
            {subscribeSuccess ? (
              <div className="bg-sage/10 border border-sage/30 p-8 text-center rounded-lg">
                <div className="w-16 h-16 mx-auto mb-6 border border-sage/50 rounded-full flex items-center justify-center">
                  <span className="text-sage text-2xl">✓</span>
                </div>
                <h3 className="font-display italic text-sage text-[24px] mb-3">You're In!</h3>
                <p className="font-sub font-light text-sage/80 text-[15px] mb-6">
                  Thank you for subscribing! You'll receive our next newsletter soon.
                </p>
                <button
                  onClick={() => setSubscribeSuccess(false)}
                  className="font-sub font-light text-sage text-[13px] hover:underline"
                >
                  Subscribe another email
                </button>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="label-accent text-warm-charcoal/50 text-[10px] block mb-2">Name (Optional)</label>
                    <input
                      type="text"
                      value={newsletterName}
                      onChange={(e) => setNewsletterName(e.target.value)}
                      disabled={isSubscribing}
                      className="w-full bg-transparent border border-faded-sand px-4 py-3.5 font-sub font-light text-warm-charcoal text-[15px] focus:outline-none focus:border-terracotta transition-colors disabled:opacity-60 rounded-none"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="label-accent text-warm-charcoal/50 text-[10px] block mb-2">Email *</label>
                    <input
                      type="email"
                      required
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      disabled={isSubscribing}
                      className="w-full bg-transparent border border-faded-sand px-4 py-3.5 font-sub font-light text-warm-charcoal text-[15px] focus:outline-none focus:border-terracotta transition-colors disabled:opacity-60 rounded-none"
                      placeholder="you@email.com"
                    />
                  </div>
                </div>
                {subscribeError && (
                  <div className="border border-terracotta/30 bg-terracotta/5 px-4 py-3">
                    <p className="font-sub font-light text-terracotta text-[13px]">{subscribeError}</p>
                  </div>
                )}
                <button
                  type="submit"
                  disabled={isSubscribing || !newsletterEmail.trim()}
                  className="btn-safari-primary text-[13px] w-full py-3.5 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubscribing ? "Subscribing..." : "Subscribe to Newsletter"}
                </button>
                <p className="label-accent text-warm-charcoal/30 text-[11px] text-center">
                  We respect your privacy. Unsubscribe anytime. No spam, ever.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;