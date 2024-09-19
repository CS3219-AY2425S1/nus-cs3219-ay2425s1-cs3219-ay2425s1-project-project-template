import Image from "next/image";

export default function Home() {
  return (
    <section className="bg-violet-800 h-screen flex items-center justify-start pl-28 pt-16">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-white mb-4 text-start">
          Connect, collaborate and <br/> code with PeerPrep
        </h1>
        <p className="text-lg text-gray-300 text-start">
          Collaborate and learn together with your peers, enhance your skills<br/>
          and prepare for technical interviews - all in one place.
        </p>
        <button className="mt-6 px-6 py-3 mx-4 bg-yellow-500 text-white font-bold rounded-lg">
          Get Started
        </button>
        <button className="mt-6 px-6 py-3 mx-4 bg-violet-800 text-yellow-500 border border-yellow-500 font-bold rounded-lg">
          Find out more
        </button>
      </div>
    </section>
  );
}
