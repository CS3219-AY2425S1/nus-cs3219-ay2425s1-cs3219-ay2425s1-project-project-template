import { useForm } from "react-hook-form";
import EmailIcon from '@mui/icons-material/Email';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import PersonIcon from '@mui/icons-material/Person'
import { Button, InputAdornment, TextField } from "@mui/material";
import { useState } from "react";
import ConfirmSettingDialog from "../../components/Settings/ConfirmDialog";
import MainLayout from "../../components/MainLayout";
import toast from "react-hot-toast";

export default function SettingsPage() {

    const [confirmSettingDialogOpen, setConfirmSettingDialogOpen] = useState(false);
    const [formData, setFormData] = useState({ username: "" });
    const handleDialogOpen = () => {
        setConfirmSettingDialogOpen(true);
    }
    const handleDialogClose = () => {
        setConfirmSettingDialogOpen(false);
    }


    const { register, handleSubmit, watch, formState: { errors }, reset } = useForm({
        defaultValues: {
            username: "",
            email: "",
            newPassword: "",
            cfmPassword: "",
        }
    });

    const username = watch("username");
    const email = watch("email");
    const newPassword = watch("newPassword");

    const onSubmit = (formData: Record<string, string>) => {
        const data = {
            username: formData.username,
            email: formData.email,
            newPassword: formData.newPassword,
        }
        if (data.username || data.email || data.newPassword) {
            setFormData(data);
            handleDialogOpen();
        } else {
            toast.error("No fields to change");
        }
    }

    return <MainLayout>
        <div className="flex flex-col min-h-full min-w-full bg-white">
            <ConfirmSettingDialog open={confirmSettingDialogOpen} handleDialogCloseFn={handleDialogClose} data={formData} formReset={reset} />
            <h1 className="font-bold text-3xl py-4">Settings</h1>
            <div className="flex-1">
                <div className="flex min-h-full items-center">
                    <div className="flex-1 justify-center items-center">
                        PICTURE
                    </div>
                    <div className="flex-1">
                        <form className="flex flex-col gap-y-4 w-4/5">
                            <TextField label="Username" variant="outlined" placeholder="Enter new username"
                                error={errors.username !== undefined}
                                helperText={errors.username?.message}
                                slotProps={{
                                    input: {
                                        startAdornment: (<InputAdornment position="start"><PersonIcon /></InputAdornment>)
                                    }
                                }}
                                {...register("username", {
                                    minLength: { value: username.length > 0 ? 4 : 0, message: "Username must be at least 4 characters." },
                                    maxLength: { value: username.length > 0 ? 20 : 0, message: "Username must be at most 20 characters." },
                                })} />
                            <TextField label="Email" variant="outlined" placeholder="Enter new email"
                                error={errors.email !== undefined}
                                helperText={errors.email?.message}
                                slotProps={{
                                    input: {
                                        startAdornment: (<InputAdornment position="start"><EmailIcon /></InputAdornment>)
                                    }
                                }}
                                {...register("email", {
                                    pattern: { value: email.length > 0 ? /[a-z0-9]+@[a-z0-9]+\.[a-z]{2,3}/ : /.*/, message: "Email is invalid" },
                                })} />
                            <TextField label="New Password" variant="outlined" type="password" placeholder="Enter new password"
                                error={errors.newPassword !== undefined}
                                helperText={errors.newPassword?.message}
                                slotProps={{
                                    input: {
                                        startAdornment: (<InputAdornment position="start"><VpnKeyIcon /></InputAdornment>)
                                    }
                                }}
                                {...register("newPassword", {
                                    minLength: { value: newPassword.length > 0 ? 6 : 0, message: "Password must be at least 6 characters." },
                                })} />
                            <TextField label="Confirm Password" variant="outlined" type="password" placeholder="Enter new password again"
                                error={errors.cfmPassword !== undefined}
                                helperText={errors.cfmPassword?.message}
                                slotProps={{
                                    input: {
                                        startAdornment: (<InputAdornment position="start"><VpnKeyIcon /></InputAdornment>)
                                    }
                                }}
                                {...register("cfmPassword",
                                    {

                                        validate: (value) => {
                                            if (value !== newPassword) {
                                                return "Password do not match."
                                            }
                                        }
                                    })} />
                            <div className="flex justify-center items-center">
                                <Button
                                    variant="contained"
                                    onClick={handleSubmit(onSubmit)}
                                    sx={{ mx: 3, borderRadius: 20 }}
                                    color="primary"
                                >
                                    Change Settings
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div >
    </MainLayout>;
}
