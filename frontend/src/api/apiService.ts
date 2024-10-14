export const fetchProtectedData = async <T>(endpoint: string): Promise<T> => {
    const token = sessionStorage.getItem('authToken');
  
    try {
      const response = await fetch(`http://localhost:5001/api/${endpoint}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
  
      const data: T = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching protected data:', error);
      throw error;
    }
  };
  