"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";

const items = [
  {
    id: "Exploring Diversity of Matter by its Physical Properties",
    label: "Exploring Diversity of Matter by its Physical Properties",
  },
  {
    id: "Exploring Diversity of Matter by its Chemical Composition",
    label: "Exploring Diversity of Matter by its Chemical Composition",
  },
  {
    id: "Model of Cells - the Basic Unit of Life",
    label: "Model of Cells - the Basic Unit of Life",
  },
  {
    id: "Model of Matter - Atoms and Molecules",
    label: "Model of Matter - Atoms and Molecules ",
  },
  {
    id: "Application of Forces and Transfer of Energy",
    label: "Application of Forces and Transfer of Energy",
  },
  {
    id: "Transfer of Heat Energy and its Effects",
    label: "Transfer of Heat Energy and its Effects",
  },
  {
    id: "Transport Systems in Living Things",
    label: "Transport Systems in Living Things",
  },
  {
    id: "Human Sexual Reproductive System",
    label: "Human Sexual Reproductive System",
  },
] as const;

const FormSchema = z.object({
  items: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
});

export function TopicsForm({ setTopics, topics }: any) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      items: [],
    },
  });

  function onChange(input: any) {
    if (topics.includes(input.target.value)) {
      setTopics(topics.filter((topic: any) => topic !== input.target.value));
    } else {
      setTopics([...topics, input.target.value]);
    }
  }

  return (
    <Form {...form}>
      <form onChange={onChange} className="space-y-8">
        <FormField
          control={form.control}
          name="items"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">
                  <div className="font-semibold text-3xl pb-5">
                    Share with us the topics you wish to learn
                  </div>
                </FormLabel>
                <FormDescription>You can select more than one</FormDescription>
              </div>
              {items.map((item) => (
                <FormField
                  key={item.id}
                  control={form.control}
                  name="items"
                  render={({ field }) => {
                    // setTopics(field.value);
                    return (
                      <FormItem
                        key={item.id}
                        className="flex flex-row items-center space-x-3 space-y-0 pb-1"
                      >
                        <FormControl>
                          <Checkbox
                            value={item.id}
                            className=""
                            checked={field.value?.includes(item.id)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, item.id])
                                : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== item.id
                                    )
                                  );
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-semibold text-xl">
                          {item.label}
                        </FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
