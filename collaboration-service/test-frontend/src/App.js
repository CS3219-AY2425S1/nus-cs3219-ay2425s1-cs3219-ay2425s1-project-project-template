import React,
{
  useState, 
  useEffect
} from 'react';

import io from 'socket.io-client';

import './App.css';


function App() {
  const [content, setContent] = useState('');

  useEffect(() => {
    socket.on('updateContent',
        (updatedContent) => {
            setContent(updatedContent);
        });

    return () => {
        socket.off('updateContent');
    };
  });

  const handleEdit = (event) => {
      const updatedContent = event.target.value;
      setContent(updatedContent);
      socket.emit('edit', updatedContent);
  };

  return (
    <div className="App">
        <h1>Real-time Collaborative Editor</h1>
        <textarea
            value={content}
            onChange={handleEdit}
            rows={10}
            cols={50}
            style={{
                fontWeight: bold ? 'bold' : 'normal',
                fontStyle: italic ? 'italic' : 'normal',
                textDecoration: underline ? 'underline' : 'none'
            }}
        />
    </div>
  );
}

export default App;
