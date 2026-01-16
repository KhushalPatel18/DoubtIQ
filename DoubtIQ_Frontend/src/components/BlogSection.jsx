import { ArrowUpRight } from "lucide-react";

const blogs = [
  {
    title: "How AI Is Transforming Student Learning",
    excerpt:
      "Artificial Intelligence is changing how students understand concepts by offering personalized and step-by-step explanations.",
    date: "March 2026",
  },
  {
    title: "Why Step-by-Step Learning Improves Retention",
    excerpt:
      "Breaking problems into smaller steps helps students grasp concepts faster and retain knowledge longer.",
    date: "February 2026",
  },
  {
    title: "The Future of AI-Powered Education Platforms",
    excerpt:
      "AI-driven tools like DoubtIQ are shaping the future of education by making learning accessible and efficient.",
    date: "January 2026",
  },
];

const BlogSection = () => {
  return (
    <section id="blogs" className="bg-gray-950 py-20">
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <div className="max-w-3xl mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Insights & <span className="text-purple-500">Learning</span>
          </h2>
          <p className="mt-4 text-gray-400">
            Read how AI is shaping modern education and helping students learn smarter.
          </p>
        </div>

        {/* Blog Cards */}
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {blogs.map((blog, index) => (
            <article
              key={index}
              className="group bg-gray-900/60 border border-gray-800 rounded-xl p-6
                         hover:border-purple-500/50 transition duration-300"
            >
              <p className="text-sm text-gray-500">{blog.date}</p>

              <h3 className="mt-3 text-xl font-semibold text-white group-hover:text-purple-400 transition">
                {blog.title}
              </h3>

              <p className="mt-3 text-gray-400 text-sm leading-relaxed">
                {blog.excerpt}
              </p>

              <div className="mt-5 flex items-center text-purple-400 text-sm font-medium">
                Read more
                <ArrowUpRight className="ml-1 h-4 w-4" />
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
};

export default BlogSection;
