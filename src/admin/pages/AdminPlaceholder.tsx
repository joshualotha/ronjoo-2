import AdminTopBar from '../components/AdminTopBar';

interface PlaceholderPageProps {
  title: string;
  description: string;
}

export default function AdminPlaceholder({ title, description }: PlaceholderPageProps) {
  return (
    <div>
      <AdminTopBar title={title} />
      <div className="p-8">
        <div className="bg-[#FFFFFF] border border-[#E8E0D5] p-16 text-center">
          <h2 className="font-display italic text-[36px] text-warm-charcoal mb-3">{title}</h2>
          <p className="font-sub font-normal text-[15px] text-warm-charcoal max-w-[500px] mx-auto">{description}</p>
          <div className="mt-8 flex justify-center gap-4">
            <button className="px-6 py-2.5 bg-terracotta text-warm-canvas font-sub font-normal text-[13px] uppercase tracking-[0.1em] hover:opacity-90">Get Started</button>
            <button className="px-6 py-2.5 border border-warm-charcoal text-warm-charcoal font-sub font-normal text-[13px] uppercase tracking-[0.1em] hover:bg-warm-charcoal hover:text-warm-canvas transition-colors">Learn More</button>
          </div>
        </div>
      </div>
    </div>
  );
}
