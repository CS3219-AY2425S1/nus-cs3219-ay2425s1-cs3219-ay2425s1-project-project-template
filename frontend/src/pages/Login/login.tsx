import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import PersonIcon from '@mui/icons-material/Person';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export default function LoginPage() {

  const{register, handleSubmit, watch, formState: {errors}} = useForm({
    defaultValues: {
      username: "",
      password: "",
    }
  });

  const {mutate, isPending} = useMutation({
    mutationFn: (data: Record<string, string>)=>{
      console.log(data)
      return axios.post("localhost:4001/login", data)
    },
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) =>{
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
        <input className={textBoxStyle} type="text" placeholder="Email" {...register("username", {required: true})}/>
        <PersonIcon fontSize="medium" className="absolute top-1/2 -translate-y-1/2 translate-x-1/3"/>
        {errors.username && <span className="absolute -bottom-6 right-0 text-base text-red-500">This field is required</span>}
      </div>
      <div className="relative flex flex-col">
        <input className={textBoxStyle} type="password" placeholder="Password" {...register("password", {required: true})}/>
        <VpnKeyIcon fontSize="medium" className="absolute top-1/2 -translate-y-1/2 translate-x-1/3"/>
        {errors.password && <span className="absolute -bottom-6 right-0 text-base text-red-500">This field is required</span>}
      </div>
      <div className="flex justify-between items-center">
        <Link className="hover:underline" to="/forgotpassword">Forgot Password?</Link>
        <button disabled={isPending} className="bg-buttonColour px-8 py-2 rounded-lg opacity-80 hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-40">Login</button>
      </div>
      </form>
      <span>Not Registered? <Link className="text-buttonColour hover:underline" to="/signup">Sign up</Link> now!</span>
    </div>
  </div>;
}
