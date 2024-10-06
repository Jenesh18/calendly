"use client"

import { usernameSchema } from "@/app/lib/validators";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useUser } from "@clerk/nextjs"
import { useForm } from "react-hook-form";
import { BarLoader } from "react-spinners";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import useFetch from "@/hooks/use-fetch";
import { updateUsername } from "@/actions/users";

const Dashboard = () => {
  const {user,isLoaded} = useUser();
 
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(usernameSchema),
  });

  useEffect(()=>{
    setValue("username", user?.username)
  },[isLoaded]);

  const { loading, error, fn: fnUpdateUsername } = useFetch(updateUsername);

  const onSubmit = async (data) => {
    await fnUpdateUsername(data.username);
  };

  return (
    <div className="space-y-4">
    <Card>
    <CardHeader>
      <CardTitle>Welcome, {user?.firstName}</CardTitle>
    </CardHeader>
    </Card>

    <Card>
        <CardHeader>
          <CardTitle>Your Unique Link</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <span>{window?.location.origin}/</span>
                <Input {...register("username")} placeholder="username" />
              </div>
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.username.message}
                </p>
              )}
              {error && (
                <p className="text-red-500 text-sm mt-1">{error?.message}</p>
              )}
            </div>
            {loading && (
              <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />
            )}
            <Button type="submit" >
              Update Username
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default Dashboard
