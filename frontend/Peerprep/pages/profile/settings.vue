<script setup>
import { useAuthStore } from '~/stores/auth';
import { ref } from 'vue';

// Form States
const displayName = ref('');
const email = ref('');
const currentPass = ref('');
const newPass = ref('');
const confirmNewPass = ref('');
const isUpdatingProfile = ref(false);
const isUpdatingPassword = ref(false);
const isDeletingAccount = ref(false);

const authStore = useAuthStore();
const { isGoogleLogin, user } = storeToRefs(authStore);

const handleUpdateProfile = async () => {
    // TODO: Check Display Name valid
    isUpdatingProfile.value = true;
    if (authStore.updateDisplayName(displayName.value)) {
        // Pop up a toast TODO: Add toasts
    } else {
        // Pop up an error toast
    }
    isUpdatingProfile.value = false;
}

const handleUpdatePassword = async () => {
    // TODO: Finish up this function https://firebase.google.com/docs/reference/js/v8/firebase.User#updatepassword
    // TODO: Add checks to make sure password is valid, use registration page
    isUpdatingPassword.value = true;
    try {
        await user.value.updatePassword(currentPass.value, newPass.value, confirmNewPass.value);
    } catch (error) {
        console.error("Error updating password:", error);
    } finally {
        isUpdatingPassword.value = false;
    }
};

const handleDeleteAccount = async () => {
    isDeletingAccount.value = true;
    isDeletingAccount.value = false;
    // TODO: Check that password is correct, then pop up a toast to double confirm that you want to remove your account with RED LETTERS
}

onMounted(() => {
    if (user.value) {
        displayName.value = user.value.displayName;
        email.value = user.value.email;
    }
});
</script>

<template>
    <div class="space-y-6 p-10 pb-16">
        <div>
            <h2 class="text-3xl font-bold tracking-tight">Account Settings</h2>
            <p class="text-muted-foreground">Manage your account settings.</p>
        </div>
        <hr data-orientation="horizontal" class="shrink-0 bg-border relative h-px w-full my-6">
        </hr>
        <h2 class="text-2xl font-bold tracking-tight">Profile Settings</h2>
        <div>
            <form @submit.prevent="handleUpdateProfile" class="space-y-4">
                <div class="grid gap-2">
                    <Label for="displayName">Display Name</Label>
                    <Input id="displayName" name="displayName" v-model="displayName" placeholder="John Appleseed"
                        type="text" />
                    <p class="text-sm text-muted-foreground">Your public display name.</p>
                </div>
                <div class="grid gap-2">
                    <Label for="email">Email Address</Label>
                    <Input id="email" name="email" v-model="email" type="email" disabled="disabled" readonly="readonly"
                        placeholder="<EMAIL>" />
                </div>
                <Button type="submit" :disabled="isUpdatingProfile">
                    {{ isUpdatingProfile ? "Updating..." : "Update Profile" }}
                </Button>
            </form>
        </div>
        <div>
            <h2 class="text-2xl font-bold tracking-tight">Password</h2>
            <p class="text-muted-foreground text-sm mt-1">Change your password.</p>
        </div>
        <div>
            <form @submit.prevent="handleUpdatePassword" class="space-y-4">
                <div class="grid gap-2">
                    <Label for="currentPass">Current Password</Label>
                    <Input id="currentPass" name="currentPass" v-model="currentPass" type="password"
                        placeholder="Enter Current Password" :disabled="isGoogleLogin" />
                </div>
                <div class="grid gap-2">
                    <Label for="newPass">New Password</Label>
                    <Input id="newPass" name="newPass" v-model="newPass" type="password"
                        placeholder="Enter New Password" :disabled="isGoogleLogin" />
                </div>
                <div class="grid gap-2">
                    <Label for="confirmNewPass">Confirm New Password</Label>
                    <Input id="confirmNewPass" name="confirmNewPass" v-model="confirmNewPass" type="password"
                        placeholder="Re-Enter Password" :disabled="isGoogleLogin" />
                </div>
                <Button type="submit" :disabled="isGoogleLogin || isisUpdatingPassword">
                    {{ isUpdatingPassword ? "Updating..." : "Update Password" }}
                </Button>
                <div class="text-sm">You are logged in with Google. Your password cannot be
                    changed.</div>
            </form>
        </div>
        <div>
            <h2 class="text-2xl font-bold tracking-tight">Delete Your Account</h2>
            <p class="text-muted-foreground text-sm mt-1">This action is irreversible!</p>
        </div>
        <div>
            <form @submit.prevent="handleDeleteAccount" class="space-y-4">
                <div class="grid gap-2">
                    <Label for="currentPass">Current Password</Label>
                    <Input id="currentPass" name="currentPass" v-model="currentPass" type="password"
                        placeholder="Enter Current Password"/>
                </div>
                <Button type="submit" :disabled="isDeletingAccount">Delete My Account</Button>
                <Button type="submit" :disabled="isDeletingAccount" class="bg-red-500 hover:bg-red-600 text-white">DELETE MY ACCOUNT</Button>
            </form>
        </div>
    </div>
</template>
