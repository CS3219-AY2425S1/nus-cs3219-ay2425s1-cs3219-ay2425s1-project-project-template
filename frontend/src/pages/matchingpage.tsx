import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode, JwtPayload } from 'jwt-decode';

interface CustomJwtPayload extends JwtPayload {
    email?: string;
    name?: string;
}

export default function MatchingPage() {

    const topic = ['Algorithm', 'DynamicProgramming', 'Array', 'SQL', 'Heap', 'Recursion', 'Graph', 'Sorting']
    const difficulty = ['easy', 'medium', 'hard']
    const lang = ['C', 'C#', 'C++', 'Go', 'Java', 'Javascript', 'Kotlin', 'Python', 'Rust', 'TypeScript']
    const navigate = useNavigate();
    const [userEmail, setUserEmail] = useState('');

    useEffect(() => {
        const jwtToken = localStorage.getItem("access_token");
    
        if (jwtToken) {
            const decodedToken = jwtDecode<CustomJwtPayload>(jwtToken);
            
            // Check if decodedToken.email is defined
            if (decodedToken.email) {
                setUserEmail(decodedToken.email);
            } else {
                console.log("Email not found in the token");
            }
        } else {
            console.log("No token found in localStorage");
            navigate('/login');
        }
    }, [navigate]);

    const [selectedTopic, setSelectedTopic] = useState(topic[0]);
    const [selectedDificulty, setSelectedDifficulty] = useState(difficulty[0]);
    const [selectedLanguage, setSelectedLanguage] = useState(lang[0]);

    const handleSubmit = async () => {
        console.log("submit button pressed");
        const requestData = {
            categories: selectedTopic,
            complexity: selectedDificulty,
            language: selectedLanguage,
            email: userEmail  
        };

        try {
            const response = await fetch('http://localhost:3009/rabbitmq/enter', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });
            
            if (response.ok) {
                console.log('Request sent successfully');
                navigate('/loading');
            } else {
                console.error('Failed to send request');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };



    return (
        <div className="grid grid-cols-4 h-screen items-center bg-gray-800">
            <div className="mx-4 min-h-[600px] bg-gray-800 outline outline-1 outline-gray-500 col-span-3 rounded-lg shadow"></div>
            <div className="mx-4 min-h-96 bg-gray-800 text-white col-span-1 rounded-lg shadow flex flex-col py-2 outline outline-1 outline-gray-500">
                <div className="flex flex-col px-4 py-2">
                    <label className="text-sm my-1 font-semibold text-left"> Select topic</label>
                    <select className="bg-gray-800 outline outline-1 outline-gray-500 my-1 h-10 rounded-lg" value={selectedTopic}
                    onChange={(e) => setSelectedTopic(e.target.value)}>
                        {topic.map((t) => (<option value={t}> {t} </option>))}
                    </select>
                </div>
                <div className="flex flex-col px-4 py-2">
                    <label className="text-sm my-1 font-semibold text-left"> Select difficulty</label>
                    <select className="bg-gray-800 outline outline-1 outline-gray-500 my-1 h-10 rounded-lg" value={selectedDificulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}>
                        {difficulty.map((level) => <option value={level}> {level} </option>)}
                    </select>

                </div>
                <div className="flex flex-col px-4 py-2">
                    <label className="text-sm my-1 font-semibold text-left"> Select Language</label>
                    <select className="bg-gray-800 outline outline-1 outline-gray-500 my-1 h-10 rounded-lg" value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}>
                        {lang.map((l) => <option value={l}> {l} </option>)}
                    </select>
                </div>

                <div className="flex flex-col justify-center px-3 my-4">
                    <hr className="my-5" />
                    <button className="bg-white h-12 rounded-lg text-center text-black w-full font-semibold" 
                    onClick={handleSubmit}>Find a Peer</button>
                </div>

            </div>
        </div>
    )
}