import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const profileVariants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    rotate: -10
  },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }
};

const textVariants = {
  hidden: {
    opacity: 0,
    x: -30
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      delay: 0.3
    }
  }
};
const About = () => {
  return (
    <motion.div
      className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 mt-4 sm:mt-8 lg:mt-10 space-y-6 sm:space-y-8 lg:space-y-10"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.section
        className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 lg:p-10 flex flex-col md:flex-row items-center gap-6 sm:gap-8 hover:shadow-xl transition-shadow duration-300"
        variants={itemVariants}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <motion.img
          src="/AlonProfile.png"
          alt="Alon Benakot"
          className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 rounded-full object-cover border-4 border-gray-200 shadow-sm"
          variants={profileVariants}
          whileHover={{
            scale: 1.05,
            rotate: 2,
            transition: { duration: 0.3 }
          }}
        />
        <motion.div
          className="text-center md:text-left flex-1"
          variants={textVariants}
        >
          <motion.h1
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-2 sm:mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Alon Benakot
          </motion.h1>
          <motion.p
            className="text-gray-600 text-base sm:text-lg lg:text-xl leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            Full-Stack Developer · Java & React · Pre-School Level Football Fan
          </motion.p>
        </motion.div>
      </motion.section>

      <motion.section
        className="bg-white rounded-2xl shadow-md p-6 sm:p-8 lg:p-10 space-y-4 sm:space-y-6 hover:shadow-lg transition-shadow duration-300"
        variants={itemVariants}
        whileHover={{ y: -5 }}
        transition={{ duration: 0.3 }}
      >
        <motion.h2
          className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-800"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          How It All Started
        </motion.h2>
        <motion.div
          className="space-y-4 sm:space-y-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <p className="text-gray-700 text-sm sm:text-base lg:text-lg leading-relaxed">
            I was raised as a normal person with normal hobbies. At no point was I ever interested in watching people
            kicking a ball. My wife thought differently. With both her parents hailing from Manchester, she grew up with football. Our first date was in a
            sports bar and I had to compete for her attention with the football game in the background. Years
            before I became a football fan myself I had to master the art of making small talk with people who actually
            knew what an offside is.
          </p>
          <p className="text-gray-700 text-sm sm:text-base lg:text-lg leading-relaxed">
            But if you haven't become a fan by the age of around 15 - you're going to have a hard
            time understanding what's going on. There is a whole lot of discourse that you aren't a part of.
            There's lingo, history, and culture that as a newcomer just seems bizarre. I still can't figure
            out why a grown man takes his shirt off after accomplishing a work-related mission. I never did that at
            the office.
          </p>
        </motion.div>
      </motion.section>

      <motion.section
        className="bg-white rounded-2xl shadow-md p-6 sm:p-8 lg:p-10 space-y-4 sm:space-y-6 hover:shadow-lg transition-shadow duration-300"
        variants={itemVariants}
        whileHover={{ y: -5 }}
        transition={{ duration: 0.3 }}
      >
        <motion.h2
          className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-800"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          What is SmallTalkFootball?
        </motion.h2>
        <motion.div
          className="space-y-4 sm:space-y-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <p className="text-gray-700 text-sm sm:text-base lg:text-lg leading-relaxed">
            Were you ever sitting down for a quiet lunch and the whole table is talking about "last night's game"? Have
            you ever been stuck in an elevator football conversation? There is no one more left out than a normal person
            around football fans.
          </p>
          <p className="text-gray-700 text-sm sm:text-base lg:text-lg leading-relaxed">
            SmallTalkFootball is a beginner-friendly platform that helps football "noobs" feel confident joining
            conversations — whether it's at the office, the bar, or the dinner table.
            With cheat cards, simplified articles, and quick facts, you'll always have something to say — even if you've
            never kicked a ball in your life.
          </p>
        </motion.div>
      </motion.section>

      <motion.section
        className="bg-white rounded-2xl shadow-md p-6 sm:p-8 lg:p-10 space-y-4 sm:space-y-6 hover:shadow-lg transition-shadow duration-300"
        variants={itemVariants}
        whileHover={{ y: -5 }}
        transition={{ duration: 0.3 }}
      >
        <motion.h2
          className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-800"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          About Me as a Developer
        </motion.h2>
        <motion.div
          className="space-y-4 sm:space-y-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <p className="text-gray-700 text-sm sm:text-base lg:text-lg leading-relaxed">
            I'm a full-stack developer with a focus on Java, Spring, React and TypeScript. I love building tools that make
            people feel more informed, confident, and included — whether they're learning to code or joining a football
            chat.
          </p>
          <p className="text-gray-700 text-sm sm:text-base lg:text-lg leading-relaxed">
            This site is built with a modern stack: Java, Spring Boot, MongoDB
            for the backend and React, Vite, Tailwind for the frontend.
          </p>
        </motion.div>
      </motion.section>
    </motion.div>
  );
};

export default About;