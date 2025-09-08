import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Code, Palette, Zap, Users } from 'lucide-react';

const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const skills = [
    { name: 'React.js', level: 95 },
    { name: 'JavaScript', level: 90 },
    { name: 'Material UI', level: 88 },
    { name: 'Tailwind CSS', level: 85 },
    { name: 'API Integration', level: 82 },
    { name: 'Unit Testing', level: 78 },
  ];

  const features = [
    {
      icon: Palette,
      title: 'Creative Design',
      description: 'Transforming ideas into stunning visual experiences with modern design principles.',
    },
    {
      icon: Code,
      title: 'Clean Code',
      description: 'Writing maintainable, scalable code following industry best practices.',
    },
    {
      icon: Zap,
      title: 'Fast Delivery',
      description: 'Efficient project delivery without compromising on quality or attention to detail.',
    },
    {
      icon: Users,
      title: 'Collaboration',
      description: 'Working closely with teams to achieve shared goals and exceed expectations.',
    },
  ];

  return (
    <section id="about" className="section-padding bg-background">
      <div className="container-custom" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-gradient">About Me</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Passionate Front-End Developer with 1 year of hands-on experience 
            crafting responsive, accessible, and modern web applications.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Story */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3 className="text-2xl font-bold mb-6">My Story</h3>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                I'm a passionate and detail-oriented Front-End Developer with 1 year of hands-on 
                experience crafting responsive, accessible, and modern web applications. My core 
                strength lies in building elegant user interfaces using React.js, Tailwind CSS, 
                Material UI, and JavaScript.
              </p>
              <p>
                I strive to deliver pixel-perfect designs that not only look good but also offer 
                great usability and performance. I enjoy collaborating with cross-functional teams, 
                solving real-world UI/UX challenges, and bringing ideas to life through code.
              </p>
              <p>
                I believe great user experiences come from a mix of thoughtful design and strong 
                front-end architecture—and I'm excited to contribute to teams that value both.
              </p>
            </div>
          </motion.div>

          {/* Skills */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h3 className="text-2xl font-bold mb-8">Skills & Expertise</h3>
            <div className="space-y-6">
              {skills.map((skill, index) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-foreground">{skill.name}</span>
                    <span className="text-sm text-muted-foreground">{skill.level}%</span>
                  </div>
                  <div className="skill-bar">
                    <motion.div
                      className="skill-progress"
                      initial={{ width: 0 }}
                      animate={isInView ? { width: `${skill.level}%` } : {}}
                      transition={{ duration: 1.5, delay: 0.8 + index * 0.1, ease: "easeOut" }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              className="card-portfolio text-center group"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                <feature.icon className="w-8 h-8 text-primary" />
              </div>
              <h4 className="text-xl font-semibold mb-4">{feature.title}</h4>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;