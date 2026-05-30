import {motion} from 'framer-motion';

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 30
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const About = () => {
  return (
    <div className="w-full">
      {/* Hero Section with Profile */}
      <motion.section
        className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="flex flex-col md:flex-row items-center gap-8 sm:gap-10 md:gap-12">
          <motion.img
            src="/AlonProfile.png"
            alt="Alon Benakot"
            className="w-40 h-40 sm:w-48 sm:h-48 lg:w-56 lg:h-56 rounded-full object-cover border-4 border-emerald-600 shadow-2xl"
            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            whileHover={{
              scale: 1.05,
              rotate: 2,
              transition: { duration: 0.3 }
            }}
          />
          <motion.div
            className="text-center md:text-left flex-1"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-100 mb-3 sm:mb-4">
              Alon Benakot
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-slate-300 leading-relaxed">
              Full-Stack Developer · Java & React · Pre-School Level Football Fan
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* How It All Started */}
      <motion.section
        className="w-full bg-slate-800/50 py-12 sm:py-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-screen-lg mx-auto px-4 sm:px-6">
          <motion.h2
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-100 mb-6 sm:mb-8"
            variants={itemVariants}
          >
            How It All Started
          </motion.h2>
          <div className="space-y-6 text-slate-300 text-base sm:text-lg leading-relaxed">
            <p>
              I was raised as a normal person with normal hobbies. At no point was I ever interested in watching people
              kicking a ball. My wife thought differently. With both her parents hailing from Manchester, she grew up with football. Our first date was in a
              sports bar and I had to compete for her attention with the football game in the background. Years
              before I became a football fan myself I had to master the art of making small talk with people who actually
              knew what an offside is.
            </p>
            <p>
              But if you haven't become a fan by the age of around 15 - you're going to have a hard
              time understanding what's going on. There is a whole lot of discourse that you aren't a part of.
              There's lingo, history, and culture that as a newcomer just seems bizarre. I still can't figure
              out why a grown man takes his shirt off after accomplishing a work-related mission. I never did that at
              the office.
            </p>
          </div>
        </div>
      </motion.section>

      {/* What is SmallTalkFootball */}
      <motion.section
        className="w-full py-12 sm:py-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-screen-lg mx-auto px-4 sm:px-6">
          <motion.h2
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-100 mb-6 sm:mb-8"
            variants={itemVariants}
          >
            What is SmallTalkFootball?
          </motion.h2>
          <div className="space-y-6 text-slate-300 text-base sm:text-lg leading-relaxed">
            <p>
              Were you ever sitting down for a quiet lunch and the whole table is talking about "last night's game"? Have
              you ever been stuck in an elevator football conversation? There is no one more left out than a normal person
              around football fans.
            </p>
            <p>
              SmallTalkFootball is a beginner-friendly platform that helps football "noobs" feel confident joining
              conversations — whether it's at the office, the bar, or the dinner table.
              With cheat cards, simplified articles, and quick facts, you'll always have something to say — even if you've
              never kicked a ball in your life.
            </p>
          </div>
        </div>
      </motion.section>

      {/* About Me as a Developer */}
      <motion.section
        className="w-full bg-slate-800/50 py-12 sm:py-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-screen-lg mx-auto px-4 sm:px-6">
          <motion.h2
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-100 mb-6 sm:mb-8"
            variants={itemVariants}
          >
            About Me as a Developer
          </motion.h2>
          <div className="space-y-6 text-slate-300 text-base sm:text-lg leading-relaxed">
            <p>
              I'm a full-stack developer with a focus on Java, Spring, React and TypeScript. I love building tools that make
              people feel more informed, confident, and included — whether they're learning to code or joining a football
              chat.
            </p>
            <p>
              This site is built with a modern stack: Java, Spring Boot, MongoDB
              for the backend and React, Vite, Tailwind for the frontend.
            </p>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default About;