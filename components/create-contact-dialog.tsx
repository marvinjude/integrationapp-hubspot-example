"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { IntegrationAppError, useIntegrationApp } from "@integration-app/react";
import { PhoneNumberInputWithDefCountry } from "@/components/phone-number-input-with-def-country";
import { TagInput } from "@/components/ui/tag-input";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { HubspotRecord } from "@/hooks/use-hubspot-record";
import { useSWRConfig } from "swr";

const createContactSchema = z.object({
  fullName: z.string().nonempty("Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().nonempty("Phone number is required"),
  company_name: z.string().nonempty("Company name is required"),
  pronouns: z.array(z.string()).min(1, "At least one pronoun is required"),
});

export function CreateContactDialog({
  records,
}: {
  records: HubspotRecord[] | undefined;
}) {
  const integrationApp = useIntegrationApp();
  const form = useForm<z.infer<typeof createContactSchema>>({
    resolver: zodResolver(createContactSchema),
    defaultValues: {
      pronouns: [],
      fullName: "",
      email: "",
      phone: "",
      company_name: "",
    },
  });
  const { toast } = useToast();
  const { mutate } = useSWRConfig();
  const [dialogIsOpen, setDialogIsOpen] = useState(false);

  useEffect(() => {
    if (form) {
      form.reset();
    }
  }, []);

  const onSubmit = async (data: z.infer<typeof createContactSchema>) => {
    if (!records) {
      return;
    }

    const { pronouns, ...otherFields } = data;
    /**
     * Optimistically update the UI
     */
    mutate(
      "records",
      [
        ...records,
        {
          id: Date.now().toString(),
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
          createdAt: new Date().toISOString(),
          pronouns: pronouns.join("/"),
          company_name: data.company_name,
        },
      ],
      false
    );

    try {
      await integrationApp
        .connection("hubspot")
        .action(process.env.NEXT_PUBLIC_HUBSPOT_CREATE_ACTION_KEY as string)
        .run({
          ...otherFields,
          pronouns: pronouns.join("/"),
        });

      setDialogIsOpen(false);

      toast({
        title: "Info",
        description: "Contact created successfully",
      });

      form.reset();

      /**
       * Refetch the records
       */
      mutate("records");
    } catch (e) {
      /**
       * Rollback the mutation
       */
      mutate("records", records, false);

      if (e instanceof IntegrationAppError) {
        return toast({
          title: "Error",
          description: e?.data?.data?.response?.data?.message,
        });
      } else {
        //////////////////////////////////////////////
        // Log to runtime error monitoring service ///
        //////////////////////////////////////////////
        return toast({
          title: "Error",
          description: "An error occurred, please try again later.",
        });
      }
    }
  };

  return (
    <Dialog onOpenChange={setDialogIsOpen} open={dialogIsOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-full">
          Create Contact
          <Plus className="w-4 h-4 ml-1" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a contact</DialogTitle>
          <DialogDescription>
            Create a contact in your Hubspot CRM
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full name</FormLabel>
                  <FormControl>
                    <Input placeholder="Jude Agboola" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="doe@it.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="company_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company name</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pronouns"
              render={() => (
                <FormItem>
                  <FormLabel>Pronouns</FormLabel>
                  <FormControl>
                    <TagInput
                      placeholder="Add pronouns"
                      value={form.getValues("pronouns")}
                      setValue={(value) => form.setValue("pronouns", value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field: { onChange, ...rest } }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <PhoneNumberInputWithDefCountry
                      onChange={onChange}
                      {...rest}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Creating..." : "Create Contact"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
