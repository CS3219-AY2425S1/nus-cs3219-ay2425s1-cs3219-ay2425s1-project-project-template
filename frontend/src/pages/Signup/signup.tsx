import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import PersonIcon from '@mui/icons-material/Person';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export default function SignupPage() {

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      email: "",
      password: "",
      cfmPassword: "",
    }
  });

  const password = watch("password");

  const { mutate, isPending } = useMutation({
    mutationFn: (data: Record<string, string>) => {
      console.log(data)
      return axios.post("Replace with signup API", data)
    },
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.log(error);
    }
  });

  const onSubmit = (data: Record<string, string>) => {
    mutate(data);
  }

  const textBoxStyle = "border-2 border-black rounded-lg w-full h-12 pl-10"

  return <div className="flex flex-row min-w-full min-h-[calc(100vh-64px)]">
    <div className="flex-1 bg-black"></div>
    <div className="flex-1 flex flex-col gap-10 bg-white text-black justify-center items-center text-lg">
      <img className="w-1/4" src="/logo-with-text.svg" />
      <form className="flex w-3/5 flex-col gap-y-8" onSubmit={handleSubmit(onSubmit)}>
        <div className="relative flex flex-col">
          <input className={textBoxStyle} type="text" placeholder="Enter email"
            {...register("email", {
              required: { value: true, message: "Email is required" },
              pattern: { value: /[a-z0-9]+@[a-z0-9]+\.[a-z]{2,3}/, message: "Email is invalid" },
            })} />
          <PersonIcon fontSize="medium" className="absolute top-1/2 -translate-y-1/2 translate-x-1/3" />
          <span className="absolute bottom-0 translate-y-full right-0 text-base text-red-500">{errors.email?.message}</span>
        </div>
        <div className="relative flex flex-col">
          <input className={textBoxStyle} type="password" placeholder="Enter password"
            {...register("password", {
              required: { value: true, message: "Password is required." },
              minLength: { value: 6, message: "Password must be at least 6 characters." }
            })} />
          <VpnKeyIcon fontSize="medium" className="absolute top-1/2 -translate-y-1/2 translate-x-1/3" />
          <span className="absolute bottom-0 translate-y-full right-0 text-base text-red-500">{errors.password?.message}</span>
        </div>
        <div className="relative flex flex-col">
          <input className={textBoxStyle} type="password" placeholder="Enter password again"
            {...register("cfmPassword",
              { required: { value: true, message: "Please enter password again." },
              validate: (value) => {
                if (value != password) {
                  return "Password do not match."
                }
              }})} />
          <VpnKeyIcon fontSize="medium" className="absolute top-1/2 -translate-y-1/2 translate-x-1/3" />
          <span className="absolute bottom-0 translate-y-full right-0 text-base text-red-500">{errors.cfmPassword?.message}</span>
        </div>
        <div className="flex justify-center items-center">
          <button disabled={isPending} className="bg-buttonColour px-12 py-2 rounded-lg opacity-80 hover:opacity-100 transition-all delay-600 disabled:cursor-not-allowed disabled:opacity-40">Sign Up</button>
        </div>
      </form>
      <span>Already have an account? <Link className="text-buttonColour hover:underline" to="/login">Login</Link> now!</span>
    </div>
  </div>;
}
