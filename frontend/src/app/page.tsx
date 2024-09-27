import Image from 'next/image'

export default function Home() {
    return (
        <section className="bg-violet-800 flex flex-grow items-center justify-start 2xl:justify-center pl-28">
            <div className="text-center 2xl:w-3/5">
                <h1 className="text-5xl font-bold text-white mb-4 text-start">
                    Connect, collaborate and <br /> code with PeerPrep
                </h1>
                <p className="text-lg text-gray-300 text-start">
                    Collaborate and learn together with your peers, enhance your
                    skills
                    <br />
                    and prepare for technical interviews - all in one place.
                </p>
                <div className="flex justify-start">
                    <button className="mt-6 px-8 py-3 mr-4 secondary-color text-white font-bold rounded-lg">
                        Get Started
                    </button>
                    <button className="mt-6 px-8 py-3 primary-color text-yellow-500 border border-yellow-500 font-bold rounded-lg">
                        Find out more
                    </button>
                </div>
            </div>
        </section>
    )
}
