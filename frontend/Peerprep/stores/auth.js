import { defineStore } from "pinia";
import { signOut, onAuthStateChanged, updateProfile } from "firebase/auth";

export const useAuthStore = defineStore('auth', () => {
    const auth = useFirebaseAuth();
    const user = ref(null);
    const isAdmin = ref(false);  // Assume User is not admin by default
    const isGoogleLogin = ref(false);

    async function refreshUser() {
        const currentUser = await getCurrentUser();

        if (currentUser) {
            user.value = currentUser;

            // Check If Admin
            const tokenResult = await currentUser.getIdTokenResult();
            const adminResult = tokenResult.claims.admin === true;
            isAdmin.value = adminResult;

            // Check If Login with Google
            const googleProvider = user.value?.providerData[0].providerId === 'google.com';
            isGoogleLogin.value = googleProvider;
        } else {
            user.value = null;
            isAdmin.value = false;
        }
    }

    // Handle sign out
    async function authSignOut() {
        await signOut(auth);
        user.value = null;
        isAdmin.value = false;
    }

    async function updateDisplayName(newDisplayName) {
        refreshUser();

        if (user.value) {
            try {
                await updateProfile(user.value, {
                    displayName: newDisplayName
                });
                return true;
            } catch (error) {
                console.error("Error updating profile:", error);
                return false;
            }
        } else {
            console.log('No user is logged in');
            return false;
        }
    }

    // Update user when auth changes
    onAuthStateChanged(auth, async (currentUser) => {
        if (currentUser) {
            await refreshUser();
        }
    })

    return {
        user,
        isAdmin,
        isGoogleLogin,
        authSignOut,
        updateDisplayName,
        refreshUser
    };
})
