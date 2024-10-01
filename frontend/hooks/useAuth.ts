import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { verifyToken } from '@/services/userService';

const useAuth = () => {
	const router = useRouter();
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [isAdmin, setIsAdmin] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const checkToken = async () => {
			try {
				const response = await verifyToken();
				const { username, email, isAdmin } = response.data;
				setUsername(username);
				setEmail(email);
				setIsAdmin(isAdmin);
			} catch (error) {
				router.push('/login');
			} finally {
				setIsLoading(false);
			}
		};

		checkToken();
	}, [router]);

	return { username, email, isAdmin, isLoading };
};

export default useAuth;
