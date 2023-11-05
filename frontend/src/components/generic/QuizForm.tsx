"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import {
  faCheckCircle,
  faCircleXmark,
  faCross,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { cn } from "@/lib";

const FormSchema = z.object({
  type: z.enum(["all", "mentions", "none"], {
    required_error: "You need to select a notification type.",
  }),
});

export function QuizForm({
  options,
  setOption,
  showAnswer = false,
  selectedAnswer,
}: any) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  const answer = options.answer;
  const [userAnswer, setUserAnswer] = useState("");

  const [arrayOption, setArrayOptions] = useState([]);

  useEffect(() => {
    const array: any = [
      options.option1,
      options.option2,
      options.option3,
      options.answer,
    ];
    // randomise the array
    const shuffled = array.sort(() => 0.5 - Math.random());
    setArrayOptions(shuffled);
  }, [options]);

  function onChange(input: any) {
    console.log(input.target.value);
    setUserAnswer(input.target.value);
    setOption(input.target.value);
  }

  return (
    <Form {...form}>
      <form onChange={onChange} className="w-full space-y-6">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={showAnswer}
                  className="flex flex-col space-y-4"
                >
                  {arrayOption.map((option: any, index: number) => (
                    <FormItem
                      key={index}
                      className="flex items-center space-x-3 space-y-0 "
                    >
                      <FormControl>
                        <RadioGroupItem value={option} />
                      </FormControl>
                      <FormLabel
                        className={cn("text-xl font-semibold", {
                          "text-green-700": showAnswer && answer === option,
                        })}
                      >
                        {option}
                      </FormLabel>
                      {showAnswer &&
                        selectedAnswer === option &&
                        answer !== option && (
                          <FontAwesomeIcon
                            icon={faCircleXmark}
                            style={{ color: "red" }}
                            className="h-5 w-5 mr-2"
                          />
                        )}
                      {showAnswer && answer === option && (
                        <FontAwesomeIcon
                          icon={faCheckCircle}
                          style={{ color: "green" }}
                          className="h-5 w-5 mr-2"
                        />
                      )}
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
