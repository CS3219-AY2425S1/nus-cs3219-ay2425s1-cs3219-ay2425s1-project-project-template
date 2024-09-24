export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col justify-center items-center p-6">
      <h1 className="text-4xl font-bold mb-4">Welcome to PeerPrep</h1>
      <p className="text-xl mb-8">Practice coding interviews with peers</p>
      <div className="space-x-4">
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
          Sign Up
        </button>
        <button className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">
          Learn More
        </button>
      </div>
    </div>
  );
}
