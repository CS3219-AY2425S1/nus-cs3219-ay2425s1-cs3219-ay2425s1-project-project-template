"use client";

import { login } from "@/api/user";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { z } from "zod";

const formSchema = z.object({
  username: z.string()
    .min(5, "Username must be at least 5 characters"),
  password: z.string()
    .min(8, "Password must be at least 8 characters"),
});

const Login = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = form.getValues();
    login(data.username, data.password);
  }

  return (
    <div className="max-w-xl mx-auto my-10 p-2">
      <h1 className="text-white font-extrabold text-h1">Login</h1>
      <p className="text-primary-300 text-lg">
        Login to our platform to access its features! Don't have an account? <a href="/register" className="text-yellow-500 hover:underline">Register here</a>
      </p>
      <Form {...form}>
        <form className="my-10 grid gap-4" onSubmit={onSubmit}>
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-yellow-500 text-lg">USERNAME</FormLabel>
                <FormControl>
                  <Input placeholder="username" {...field} className="focus:border-yellow-500 text-white"/>
                </FormControl>
                {/* <FormDescription>This is your public display name.</FormDescription> */}
                <FormMessage/>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-yellow-500 text-lg">PASSWORD</FormLabel>
                <FormControl>
                  <Input placeholder="password" type="password" {...field} className="focus:border-yellow-500 text-white"/>
                </FormControl>
                {/* <FormDescription>This is your public display name.</FormDescription> */}
                <FormMessage/>
              </FormItem>
            )}
          />
          <Button type="submit" className="bg-yellow-500 hover:bg-yellow-300 px-4 py-2 my-2 rounded-md text-black">Login</Button>
        </form>
      </Form>
    </div>
  );
};

export default Login;