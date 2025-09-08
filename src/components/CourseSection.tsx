import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Play, Clock, Users, Star, Award, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import pythonCertificate from "../assets/python-certificate.jpg";
import frontendCertficate from "../assets/Frontend-certificate.jpg";

const CourseSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  // Add state for modal
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const courses = [
    {
      title: "Frontend Development",
      description:
        "Comprehensive course covering HTML5, CSS3, JavaScript, React.js, and modern frontend development practices.",
      thumbnail:
        "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400",
      certificate: frontendCertficate, // Use a real certificate image here
      duration: "Certificate",
      students: "Completed",
      rating: 5.0,
      level: "Advanced",
      price: "Certified",
      features: [
        "HTML5 & CSS3",
        "JavaScript ES6+",
        "React.js Development",
        "Responsive Web Design",
        "Modern Frontend Tools",
      ],
    },
    {
      title: "Immersive Python Bootcamp Premium",
      description:
        "Intensive premium bootcamp covering Python fundamentals, data structures, web development, and advanced programming concepts.",
      thumbnail:
        "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400",
      certificate: pythonCertificate,
      duration: "Certificate",
      students: "Completed",
      rating: 5.0,
      level: "Intermediate",
      price: "Certified",
      features: [
        "Python Fundamentals",
        "Data Structures & Algorithms",
        "Web Development with Flask",
        "Database Integration",
        "API Development",
      ],
    },
  ];

  const achievements = [
    { icon: Users, value: "1+", label: "Year Experience" },
    { icon: Star, value: "React.js", label: "Specialization" },
    { icon: Award, value: "2+", label: "Certifications" },
    { icon: Play, value: "10+", label: "Projects Built" },
  ];

  // Modal close handler
  const handleClose = () => setOpenIndex(null);

  return (
    <section id="course" className="section-padding bg-background">
      <div className="container-custom" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-gradient">
            Completed Courses
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Continuous learning and professional development through specialized
            courses and certifications in frontend development.
          </p>
        </motion.div>

        {/* Achievement Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 mb-20">
          {achievements.map((achievement, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <achievement.icon className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
              </div>
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-1">
                {achievement.value}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground px-1">
                {achievement.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Courses Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              className="card-portfolio group overflow-hidden"
            >
              {/* Course Thumbnail */}
              <div className="relative mb-6 rounded-lg overflow-hidden">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
                <div className="absolute top-4 left-4">
                  <span className="bg-accent text-white text-xs font-semibold px-2 py-1 rounded-full">
                    {course.level}
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <span className="bg-black/50 text-white text-sm font-semibold px-3 py-1 rounded-full backdrop-blur-sm">
                    {course.price}
                  </span>
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Play className="w-8 h-8 text-white ml-1" />
                  </div>
                </div>
              </div>

              {/* Course Info */}
              <div className="mb-4">
                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                  {course.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  {course.description}
                </p>
              </div>

              {/* Course Stats */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {course.duration}
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  {course.students}
                </div>
                <div className="flex items-center">
                  <Star className="w-4 h-4 mr-1 text-yellow-500" />
                  {course.rating}
                </div>
              </div>

              {/* Course Features */}
              <div className="mb-6">
                <h4 className="font-semibold text-sm mb-3 text-foreground">
                  What you'll learn:
                </h4>
                <ul className="space-y-1">
                  {course.features.slice(0, 3).map((feature, i) => (
                    <li
                      key={i}
                      className="text-sm text-muted-foreground flex items-center"
                    >
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3 flex-shrink-0"></div>
                      {feature}
                    </li>
                  ))}
                  {course.features.length > 3 && (
                    <li className="text-sm text-muted-foreground">
                      +{course.features.length - 3} more topics
                    </li>
                  )}
                </ul>
              </div>

              {/* CTA Button */}
              <Button
                className="w-full btn-hero group-hover:shadow-glow"
                onClick={() => setOpenIndex(index)}
              >
                View Certificate
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Certificate Modal */}
        {openIndex !== null && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
            onClick={handleClose}
          >
            <div
              className="relative bg-white rounded-lg shadow-lg max-w-lg w-full p-4"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
            >
              <button
                className="absolute top-2 right-2 text-gray-600 hover:text-red-500"
                onClick={handleClose}
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>
              <img
                src={
                  openIndex === 0
                    ? import.meta.env.BASE_URL +
                      "src/assets/Frontend-certificate.jpg"
                    : import.meta.env.BASE_URL +
                      "src/assets/python-certificate.jpg"
                }
                alt={
                  openIndex === 0
                    ? "Frontend Certificate"
                    : "Python Certificate"
                }
                className="w-full h-auto rounded"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CourseSection;
