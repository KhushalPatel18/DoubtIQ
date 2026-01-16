import { Brain, BookOpen, Sparkles } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Understanding",
    description:
      "DoubtIQ intelligently analyzes your questions and provides accurate, meaningful explanations.",
  },
  {
    icon: BookOpen,
    title: "Step-by-Step Explanations",
    description:
      "Each answer is broken down into simple steps to improve clarity and conceptual learning.",
  },
  {
    icon: Sparkles,
    title: "Simple & Student-Friendly",
    description:
      "Designed specifically for students, with easy language and a distraction-free experience.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="bg-gray-950 py-20">
      <div className="max-w-7xl mx-auto px-6">

        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Why Choose <span className="text-purple-500">DoubtIQ</span>?
          </h2>
          <p className="mt-4 text-gray-400">
            DoubtIQ helps students learn smarter by providing instant,
            structured, and easy-to-understand solutions.
          </p>
        </div>

        {/* Features Grid */}
        <div className="mt-16 grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-xl p-6 
                         hover:border-purple-500/50 transition duration-300"
            >
              <feature.icon className="h-10 w-10 text-purple-500" />

              <h3 className="mt-4 text-xl font-semibold text-white">
                {feature.title}
              </h3>

              <p className="mt-3 text-gray-400 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default FeaturesSection;
