import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Calendar, MapPin, ExternalLink, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ExperienceSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [expandedProject, setExpandedProject] = useState<number | null>(null);

  const experiences = [
    {
      title: 'Junior Frontend Developer',
      company: 'ByClarityTech',
      location: 'Remote',
      period: 'Sep 2024 – Jul 2025',
      description: 'Worked on multiple real-world projects such as Dubai Realest, CCO Central Coast Orthodontics, and Berry Studio platforms using React, and Material UI. Focused on UI development, API integration, and performance optimization.',
      achievements: [
        'Delivered multiple real-world projects with React and Material UI',
        'Specialized in UI development and API integration',
        'Focused on performance optimization and user experience',
      ],
    },
    {
      title: 'Frontend Developer Intern',
      company: 'Parkqwik',
      location: 'Remote',
      period: 'July 2024 – Aug 2024',
      description: 'Contributed to the UI development of Parkqwik, a leading EV parking mobile application. Focused on building responsive mobile-first components, enhancing user experience, and ensuring cross-device compatibility.',
      achievements: [
        'Built responsive mobile-first components',
        'Enhanced user experience for EV parking application',
        'Ensured cross-device compatibility and responsiveness',
      ],
    },
  ];

  const projects = [
    {
      title: 'B.Tech – Computer Science and Engineering',
      client: 'Nandha Engineering College',
      description: 'Major in Computer Science and Engineering from Nandha Engineering College (NEC), a private institution established in 2001 in Erode, Tamil Nadu.',
      technologies: ['Data Structures', 'Algorithms', 'Database Systems', 'Software Engineering'],
      results: '2017 - 2021',
      link: '#',
    },
    {
      title: 'HSC – Computer Science',
      client: 'Vidhya Vikas Matric Hr. Sec. School',
      description: 'Higher Secondary Certificate in Computer Science. The school is known for its academic excellence and commitment to holistic education.',
      technologies: ['Computer Science', 'Mathematics', 'Physics'],
      results: 'Completed 2017',
      link: '#',
    },
    {
      title: 'SSLC',
      client: 'Vidhya Vikas Matric Hr. Sec. School',
      description: 'Secondary School Leaving Certificate. The school is known for its academic excellence and commitment to holistic education.',
      technologies: ['Mathematics', 'Science', 'English'],
      results: 'Completed 2015',
      link: '#',
    },
  ];

  return (
    <section id="experience" className="section-padding bg-muted/30">
      <div className="container-custom" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="h2-responsive font-bold mb-6 text-gradient">Experience</h2>
          <p className="text-responsive-lg text-muted-foreground max-w-3xl mx-auto">
            A journey of growth, learning, and creating impactful digital solutions.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="mb-20">
          <h3 className="h3-responsive font-bold mb-12 text-center">Professional Journey</h3>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-6 sm:left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-primary/30 transform md:-translate-x-0.5"></div>
            
            {experiences.map((exp, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className={`relative flex items-center mb-12 ${
                  index % 2 === 0 ? 'md:flex-row-reverse' : ''
                }`}
              >
                {/* Timeline dot */}
                <div className="absolute left-6 sm:left-8 md:left-1/2 w-4 h-4 bg-primary rounded-full transform md:-translate-x-2 z-10 border-4 border-background"></div>
                
                {/* Content */}
                <div className={`card-portfolio ml-14 sm:ml-20 md:ml-0 md:w-5/12 ${
                  index % 2 === 0 ? 'md:mr-auto md:pr-12' : 'md:ml-auto md:pl-12'
                }`}>
                    <div className="flex items-start flex-col lg:flex-row justify-between mb-4">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xl font-bold text-foreground text-left break-words">{exp.title}</h4>
                        <p className="text-primary font-semibold text-left break-words">{exp.company}</p>
                      </div>
                      <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full whitespace-nowrap lg:ml-4">
                        {exp.period}
                      </span>
                    </div>
                    
                    <div className="flex items-center text-sm text-muted-foreground mb-4 text-left">
                      <MapPin className="w-4 h-4 mr-2" />
                      {exp.location}
                    </div>
                    
                    <p className="text-muted-foreground mb-4 text-left">{exp.description}</p>
                    
                    <ul className="space-y-3">
                      {exp.achievements.map((achievement, i) => (
                        <li key={i} className="flex items-start text-sm text-muted-foreground text-left">
                          <ChevronRight className="w-4 h-4 mr-2 mt-0.5 text-primary flex-shrink-0" />
                          {achievement}
                        </li>
                      ))}
                    </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Featured Education */}
        <div>
          <h3 className="h3-responsive font-bold mb-12 text-center">Education</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-end">
            {projects.map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                className="card-portfolio group cursor-pointer"
                onClick={() => setExpandedProject(expandedProject === index ? null : index)}
              >
                <div className="flex items-start justify-between mb-4">
                  <h4 className="text-xl font-bold group-hover:text-primary transition-colors">
                    {project.title}
                  </h4>
                  <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                
                <p className="text-sm text-primary font-semibold mb-3">{project.client}</p>
                <p className="text-muted-foreground mb-4 leading-relaxed">{project.description}</p>
                
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.slice(0, 3).map((tech, i) => (
                      <span key={i} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">
                        +{project.technologies.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
                
                {expandedProject === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t border-border pt-4 mt-4"
                  >
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.map((tech, i) => (
                        <span key={i} className="text-xs bg-secondary/10 text-secondary px-2 py-1 rounded-full">
                          {tech}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-accent">{project.results}</span>
                      <Button size="sm" variant="outline" className="text-xs">
                        {expandedProject === index ? 'Show Less' : 'Learn More'}
                      </Button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;