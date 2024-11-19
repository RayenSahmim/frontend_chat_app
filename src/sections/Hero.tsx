const Hero = () => {
  return (
    <section className="mt-20">
      <div className="flex flex-col gap-10">

        <p className="px-4 py-2 w-fit mx-auto bg-primary-medium text-white text-center  rounded-full hover:scale-105 hover:bg-primary">
        "Fast 🚀. Secure 🛡️. Connected 🤝."
        </p>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center text-primary w-full md:max-w-2xl lg:max-w-4xl xl:max-w-5xl mx-auto  ">
        Experience seamless messaging with real-time chats, media sharing, and instant notifications. Stay close to your loved ones and collaborate effortlessly—all in one place.
        </h1>
        <h2
          className="max-w-2xl mx-auto text-center font-semibold 
        "
        >
          Join our community and unlock the power of real-time communication
        </h2>
        <form className="flex items-center justify-between border border-primary-light rounded-full bg-transparent max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-5xl   w-full pl-2 mx-auto">
          <input className="bg-transparent px-4 py-2 md:py-4 hover:outline-none flex-grow" placeholder="Enter your email"/>
          <button className="bg-primary-light text-white px-4 py-2 md:py-4 rounded-full hover:bg-primary">Get Started</button>
        </form>
      </div>
    </section>
  );
};

export default Hero;
