import { ReactNode } from "react";

interface EditorialIntroProps {
  id?: string;
  title?: string;
  subtitle?: string;
  children?: ReactNode;
}

const EditorialIntro = ({ 
  id = "editorial-intro",
  title = "Editorial",
  subtitle = "Insights from the field",
  children 
}: EditorialIntroProps) => {
  return (
    <section id={id} className="py-16 md:py-24 bg-warm-canvas/30">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
        <div className="text-center mb-12">
          <h2 className="heading-display text-warm-charcoal text-[36px] md:text-[48px] mb-4">
            {title}
          </h2>
          <div className="w-16 h-[1px] bg-terracotta mx-auto mb-6" />
          <p className="font-sub text-warm-charcoal/60 text-lg max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>
        
        {children && (
          <div className="mt-12">
            {children}
          </div>
        )}
      </div>
    </section>
  );
};

export default EditorialIntro;