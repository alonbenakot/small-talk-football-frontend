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
        <h2 className="text-2xl font-semibold text-gray-800">How It All Started</h2>
        <p className="text-gray-700">
          I was born and raised a normal person with normal hobbies. At no point was I ever interested in watching other
          people play a game. If it looks fun I'll play it, but watching other people play? Boring. My wife thought
          differently. With both her parents hailing from Manchester, she grew up with football. Our first date was in a
          sports bar and I had to compete for her attention with the football game playing in the background. Years
          before I became a football fan myself i had to master the art of making small talk with people who actually
          new what an offside is.
        </p>
        <p className="text-gray-700">
          But I noticed something: if you haven't become a fan by the age of around 15 - you're going to have a hard
          time understanding what's going on. There is a whole lot of discourse that you aren't a part of.
          There’s lingo, history, and culture that can feel overwhelming for newcomers. There are things that even I
          don't understand yet - why is a grown up man taking his shirt off during work? If someone did that in an
          office he would be fired.
        </p>
      </section>

      <section className="bg-white rounded-2xl shadow-md p-4 space-y-4">
        <h2 className="text-2xl font-semibold text-gray-800">What is SmallTalkFootball?</h2>
        <p className="text-gray-700">
          SmallTalkFootball is a beginner-friendly platform that helps football "noobs" feel confident joining football
          conversations — whether it’s at the office, the bar, or the dinner table.
        </p>
        <p className="text-gray-700">
          With cheat cards, simplified articles, and quick facts, you’ll always have something to say — even if you’ve
          never kicked a ball in your life.
        </p>
      </section>

      <section className="bg-white rounded-2xl shadow-md p-4 space-y-4">
        <h2 className="text-2xl font-semibold text-gray-800">About Me as a Developer</h2>
        <p className="text-gray-700">
          I'm a full-stack developer with a focus on Java, Spring, React and TypeScript. I love building tools that make
          people feel more informed, confident, and included — whether they’re learning to code or joining a football
          chat.
        </p>
        <p className="text-gray-700">
          This site is built with a modern stack: React + Vite + Tailwind on the frontend, backed by a Java Spring Boot
          API. I’m actively looking for opportunities where I can contribute, learn, and build products that make a real
          difference.
        </p>
      </section>
    </main>
  );
};

export default About;


