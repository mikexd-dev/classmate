"use client";

import React from "react";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { createChaptersSchema } from "@/lib/validators";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Info, Loader2, Plus, Search, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useWalletAuth } from "@/modules/wallet/hooks/useWalletAuth";
type Props = {};

type Input = z.infer<typeof createChaptersSchema>;

const CreateCourseForm = (props: Props) => {
  const router = useRouter();
  const { toast } = useToast();

  const [input, setInput] = React.useState("");

  const { mutate: createChapters, isLoading } = useMutation({
    mutationFn: async () => {
      const response = await axios.post("/api/course/chapters", {
        title: input,
      });
      return response.data;
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input === "") {
      window.alert("Please enter a name for your notebook");
      return;
    }
    createChapters(undefined, {
      onSuccess: ({ course_id }) => {
        toast({
          title: "Success",
          description: "Course created",
        });
        router.push(`/create/${course_id}`);
      },

      onError: () => {
        toast({
          title: "Error",
          description: "Error creating course",
          variant: "destructive",
        });
      },
    });
  };

  return (
    <div className="w-full">
      {/* <Form {...form}> */}
      <form onSubmit={handleSubmit} className="w-full my-5">
        <div className="flex flex-row justify-center items-center space-x-5">
          <Image
            src="/mohawk.svg"
            width={150}
            height={150}
            alt="Hero Image"
            className="absolute inset-0 w-24 hidden sm:block sm:left-[2%] sm:top-[10%] 
            lg:w-40 lg:top-[8%] lg:left-[20%] -z-2"
          />
          <div className="flex-2 relative ">
            <Search className="h-4 w-4 absolute top-3 left-3 text-slate-600" />
            <Input
              onChange={(e) => setInput(e.target.value)}
              value={input}
              className="w-full sm:w-[300px] md:w-[450px] pl-9 rounded-full bg-slate-100 focus-visible:ring-slate-200"
              placeholder="Enter a topic you'd like to learn about"
            />
          </div>

          <Button type="submit" className=" " disabled={isLoading}>
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Let's Go!
          </Button>
        </div>
        <div className="flex flex-row justify-center items-center">
          <div className="flex items-center px-2 py-1 mt-2 border-none bg-orange-100 text-xs rounded-xl ">
            <Info className="w-5 mr-3 text-orange-400" />
            <div className="font-normal">
              Note: Generation might take a little while & Any errors might be
              due to daily Youtube API quota
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateCourseForm;
