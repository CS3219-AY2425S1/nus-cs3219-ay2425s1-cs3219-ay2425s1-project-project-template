<script setup>
import { useAuthStore } from '~/stores/auth';
import { useToast } from '~/components/ui/toast';
import { ref } from 'vue';

// Form States
const displayName = ref('');
const email = ref('');
const currentPass = ref('');
const deleteAccCurrentPass = ref('');
const newPass = ref('');
const confirmNewPass = ref('');
const isUpdatingProfile = ref(false);
const isUpdatingPassword = ref(false);
const isDeletingAccount = ref(false);
const showInvalidDisplayNameLengthError = ref(false);
const showInvalidDisplayNameContentsError = ref(false);
const showInvalidNewPasswordError = ref(false);

const authStore = useAuthStore();
const { isGoogleLogin, user } = storeToRefs(authStore);
const { toast } = useToast();

const displayNameLengthNotValid = () => {
    const displayNameValue = displayName.value || '';
    const displayNameLengthCheck = displayNameValue.length >=2 && displayNameValue.length <= 50;
    console.log(displayNameValue.length);
    return !displayNameLengthCheck
};

const displayNameContentsNotValid = () => {
    const displayNameValue = displayName.value || '';
    const displayNamePattern = /^[a-zA-Z0-9 _-]+$/;
    return !displayNamePattern.test(displayNameValue)
};

const handleUpdateProfile = async () => {
    isUpdatingProfile.value = true;
    showInvalidDisplayNameContentsError.value = false;
    showInvalidDisplayNameLengthError.value = false;
    
    if (displayNameLengthNotValid()) {
        showInvalidDisplayNameLengthError.value = true;
        isUpdatingProfile.value = false;
        return;
    }

    if (displayNameContentsNotValid()) {
        showInvalidDisplayNameContentsError.value = true;
        isUpdatingProfile.value = false;
        return;
    }

    if (authStore.updateDisplayName(displayName.value)) {
        toast({
            description: 'Successfully updated profile.',
        })
    } else {
        toast({
            description: 'Failed to update profile.',
            variant: 'destructive',
        });
    }
    isUpdatingProfile.value = false;
    showInvalidDisplayNameContentsError.value  = false;
    showInvalidDisplayNameLengthError.value = false;
}

const passwordRequirementNotMet = computed(() => {
    const passwordValue = newPass.value || '';  // Ensure that passwordValue is a string
    const passwordLengthNotSatisfied = passwordValue.length < 6;
    return passwordLengthNotSatisfied && (passwordValue != "");
});

const passwordMismatch = computed(() => {
    return (newPass.value !== confirmNewPass.value) && (confirmNewPass.value != "");
});

// For the Update Password Button
const newPasswordFieldsNotValid = computed(() => {
    let valuesNotValid = (passwordRequirementNotMet.value || passwordMismatch.value);
    let valuesEmpty = (newPass.value == "") || (confirmNewPass.value == "") || (currentPass.value == "");

    return valuesNotValid || valuesEmpty || isUpdatingPassword;
});

const handleUpdatePassword = async () => {
    // TODO: Add checks to make sure password is valid, use registration page
    // TODO: Do another check to make sure account is not Google account
    isUpdatingPassword.value = true;
    showInvalidNewPasswordError.value = false;

    // Check that new password is valid
    // if (passwordRequirementNotMet) {
    //     showInvalidNewPasswordError.value = true;
    //     return;
    // }

    // Reauthenticate User (check if current password is correct)
    try {
        await authStore.reauthenticateWithPassword(currentPass.value);
    } catch (error) {
        let errorCode = error.code;
        if (errorCode == 'auth/invalid-credential') {
            console.log("Current Password Incorrect"); // TODO:Show label
        } else {
            console.log("Unknown Error while Reauthenticating User: " + error.message);
        }
        isUpdatingPassword.value = false;
        return;
    }
   
    try {
        await authStore.updatePassword(newPass.value);
    } catch (error) {
        let errorCode = error.code;
        if (errorCode == 'auth/invalid-credential') {
            console.log("Current Password Incorrect"); // TODO:Show label
        } else {
            console.log("Unknown Error: " + error.message);
        }
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
                <div>
                    <p v-if="showInvalidDisplayNameLengthError" class="text-red-500 text-sm">Display Name Length should be between 2 and 50 characters.</p>
                    <p v-if="showInvalidDisplayNameContentsError" class="text-red-500 text-sm">Display Name contents are not valid.</p>
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
                <Button type="submit" :disabled="isGoogleLogin || isUpdatingPassword">
                    {{ isUpdatingPassword ? "Updating..." : "Update Password" }}
                </Button>
                <div v-if="isGoogleLogin" class="text-sm">You are logged in with Google. Your password cannot be
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
                    <Label for="deleteAccCurrentPass">Current Password</Label>
                    <Input id="deleteAccCurrentPass" name="deleteAccCurrentPass" v-model="deleteAccCurrentPass" type="password"
                        placeholder="Enter Current Password" />
                </div>
                <Button type="submit" :disabled="isDeletingAccount">Delete My Account</Button>
                <Button type="submit" :disabled="isDeletingAccount"
                    class="bg-red-500 hover:bg-red-600 text-white">DELETE MY ACCOUNT</Button>
            </form>
        </div>
    </div>
</template>
