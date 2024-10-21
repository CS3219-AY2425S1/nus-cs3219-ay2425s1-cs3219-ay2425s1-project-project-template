<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';
import { ref } from 'vue';
import type { UserProfile } from '~/types/UserProfile';

const authStore = useAuthStore();
const isLoading = ref(true);
const { user } = storeToRefs(authStore);

const userProfile = ref<UserProfile>({
    displayName: '',
    email: '',
    photoUrl: '',
})


onMounted(() => {
    if (user.value) {
        userProfile.value.displayName = user.value.displayName;
        userProfile.value.photoUrl = user.value.photoUrl;
        userProfile.value.email = user.value.email;
    }
    isLoading.value = false;
});
</script>

<template>
    <div class="container mx-auto py-10">
        <!-- User Info Section -->
        <div class="flex items-center space-x-6">
            <!-- Profile Picture -->
            <div class="w-20 h-20 rounded-full bg-gray-200">
                <img :src="userProfile.photoUrl || ''" alt="Profile Picture"
                    class="w-full h-full rounded-full object-cover" />
            </div>

            <!-- User Info -->
            <div>
                <h2 class="text-2xl font-semibold">
                    {{ userProfile.displayName || 'Anonymous' }}
                </h2>
                <p class="text-gray-500">{{ userProfile.email }}</p>
            </div>

            <!-- Edit Profile Button -->
            <div>
                <router-link to="/profile/settings">
                    <Button class="btn bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                        @click="goToSettings">
                        Edit Profile
                    </Button>
                </router-link>
            </div>
        </div>

        <h2 class="text-2xl font-semibold mt-10">Attempt History:</h2>

        <!-- Match History Section -->
        <div class="mt-4">
            <div v-if="isLoading" class="text-gray-500">Loading History...</div>
            <div v-else class="text-gray-500"> <!-- Empty State for No Attempts History -->
                No attempts found.
            </div>
            <!-- <AttemptHistoryTable></AttemptHistoryTable> -->
        </div>
    </div>
</template>