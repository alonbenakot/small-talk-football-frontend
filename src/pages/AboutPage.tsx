const About = () => {
  return (
    <main className="max-w-5xl mx-auto p-6 mt-10 space-y-10">
      <section className="bg-white rounded-2xl shadow-lg p-4 flex flex-col md:flex-row items-center gap-6">
        <img
          src="/public/AlonProfile.png"
          alt="Alon Benakot"
          className="w-40 h-40 rounded-full object-cover border-4 border-gray-200 shadow-sm"
        />
        <div className="text-center md:text-left">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Alon Benakot</h1>
          <p className="text-gray-600 text-lg">
            Full-Stack Developer · Java & React · Pre-School Level Football Fan
          </p>
        </div>
      </section>

      <section className="bg-white rounded-2xl shadow-md p-4 space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">How It All Started</h2>
        <p className="text-gray-700">
          I was raised as a normal person with normal hobbies. At no point was I ever interested in watching people
          kicking a ball. My wife thought
          differently. With both her parents hailing from Manchester, she grew up with football. Our first date was in a
          sports bar and I had to compete for her attention with the football game in the background. Years
          before I became a football fan myself I had to master the art of making small talk with people who actually
          new what an offside is.
        </p>
        <p className="text-gray-700">
          But if you haven't become a fan by the age of around 15 - you're going to have a hard
          time understanding what's going on. There is a whole lot of discourse that you aren't a part of.
          There’s lingo, history, and culture that as a newcomer just seems bizarre. I still cant figure
          out why a grown man takes his shirt off after accomplishing a work-related mission. I never did that at
          the office.
        </p>
      </section>

      <section className="bg-white rounded-2xl shadow-md p-4 space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">What is SmallTalkFootball?</h2>
        <p className="text-gray-700">
          Were you ever sitting down for a quiet lunch and the whole table is talking about "last night's game"? Have
          you ever been stuck in an elevator football conversation? There is no one more left out than a normal person
          around football fans.
        </p>
        <p className="text-gray-700">
          SmallTalkFootball is a beginner-friendly platform that helps football "noobs" feel confident joining
          conversations — whether it's at the office, the bar, or the dinner table.
          With cheat cards, simplified articles, and quick facts, you'll always have something to say — even if you've
          never kicked a ball in your life.
        </p>
      </section>

      <section className="bg-white rounded-2xl shadow-md p-4 space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">About Me as a Developer</h2>
        <p className="text-gray-700">
          I'm a full-stack developer with a focus on Java, Spring, React and TypeScript. I love building tools that make
          people feel more informed, confident, and included — whether they’re learning to code or joining a football
          chat.
        </p>
        <p className="text-gray-700">
          This site is built with a modern stack: Java, Spring Boot, MongoDb
          for the backend and React, Vite, Tailwind for the frontend .
        </p>
      </section>
    </main>
  );
};

export default About;


