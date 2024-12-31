"use client";

import { z } from "zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { UserButton } from "@clerk/nextjs";
import { useEffect } from "react";
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
import {
  IntegrationAppError,
  useConnections,
  useIntegrationApp,
} from "@integration-app/react";
import { PhoneNumberInputWithDefCountry } from "@/components/PhoneNumberInputWithDefCountry";
import useSWR from "swr";
import { TagInput } from "@/components/ui/tag-input";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

/**
 * SUGGESTIONS:
 * - We need to work on typing for ts users, we can have a cli that generates types for the user based on their output schema
 * - We need a tonne of usage examples
 * - We need to fix a server component issue for older react / nextjs versions
 * - We neeed a discord community to support customers
 * - We need to fix our documentation
 * - We need to pass back the id of the authenticated workspace to URI
 * - Unable to crate output schema for the create-contact action the UI keeps jumping. I had to access the response data directly from the response object
 */
interface HubspotRecords {
  id: string;
  name: string;
}

function useHubspotRecords(
  { enabled }: { enabled?: boolean } = {
    enabled: true,
  }
) {
  const integrationApp = useIntegrationApp();

  const { data, error, isLoading } = useSWR(
    enabled ? "records" : null,
    async () => {
      const actionResponse = await integrationApp
        .connection("hubspot")
        .action("list-data-records")
        .run();

      return actionResponse;
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateOnMount: true,
    }
  );

  return {
    records: data?.output.records as HubspotRecords[],
    error,
    isLoading,
  };
}

function Spinner({
  color = "#fff",
  className,
}: {
  color?: string;
  className?: string;
}) {
  return (
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      viewBox="0 0 2400 2400"
      xmlSpace="preserve"
      width="24"
      height="24"
      className={className}
    >
      <g
        strokeWidth="200"
        strokeLinecap="round"
        stroke={color}
        fill="none"
        id="spinner"
      >
        <line x1="1200" y1="600" x2="1200" y2="100" />
        <line opacity="0.5" x1="1200" y1="2300" x2="1200" y2="1800" />
        <line opacity="0.917" x1="900" y1="680.4" x2="650" y2="247.4" />
        <line opacity="0.417" x1="1750" y1="2152.6" x2="1500" y2="1719.6" />
        <line opacity="0.833" x1="680.4" y1="900" x2="247.4" y2="650" />
        <line opacity="0.333" x1="2152.6" y1="1750" x2="1719.6" y2="1500" />
        <line opacity="0.75" x1="600" y1="1200" x2="100" y2="1200" />
        <line opacity="0.25" x1="2300" y1="1200" x2="1800" y2="1200" />
        <line opacity="0.667" x1="680.4" y1="1500" x2="247.4" y2="1750" />
        <line opacity="0.167" x1="2152.6" y1="650" x2="1719.6" y2="900" />
        <line opacity="0.583" x1="900" y1="1719.6" x2="650" y2="2152.6" />
        <line opacity="0.083" x1="1750" y1="247.4" x2="1500" y2="680.4" />
        <animateTransform
          attributeName="transform"
          attributeType="XML"
          type="rotate"
          keyTimes="0;0.08333;0.16667;0.25;0.33333;0.41667;0.5;0.58333;0.66667;0.75;0.83333;0.91667"
          values="0 1199 1199;30 1199 1199;60 1199 1199;90 1199 1199;120 1199 1199;150 1199 1199;180 1199 1199;210 1199 1199;240 1199 1199;270 1199 1199;300 1199 1199;330 1199 1199"
          dur="0.83333s"
          begin="0s"
          repeatCount="indefinite"
          calcMode="discrete"
        />
      </g>
    </svg>
  );
}

import { Building2, Mail, Phone, Plus } from "lucide-react";

interface UserCardProps {
  fullName: string;
  companyName: string;
  email: string;
  phone: string;
  pronouns: string;
  avatarUrl?: string;
  createdAt?: string;
}

function UserCard({
  fullName,
  companyName,
  email,
  phone,
  pronouns,
  avatarUrl,
}: UserCardProps) {
  return (
    <Card className="w-full mx-auto">
      <CardHeader className="flex flex-row items-center gap-4 p-2 px-4">
        <Avatar className="w-10 h-10">
          <AvatarImage src={avatarUrl} alt={fullName} />
          {/* Random background */}
          <AvatarFallback style={{ backgroundColor: "hsl(0, 0%, 90%)" }}>
            {fullName
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-xl">{fullName}</CardTitle>
          <div className="flex gap-2">
            <p className="text-sm text-muted-foreground">{pronouns}</p> •
            <p className="text-sm text-muted-foreground">
              {new Date(
                new Date().getTime() - Math.floor(Math.random() * 10000000000)
              ).toLocaleDateString()}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="gap-4">
        <div className="flex gap-2 text-sm">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-muted-foreground" />
            <span>{companyName}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <a
              href={`mailto:${email}`}
              className="text-primary hover:underline"
            >
              {email}
            </a>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-muted-foreground" />
            <a href={`tel:${phone}`} className="text-primary hover:underline">
              {phone}
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const createContactSchema = z.object({
  fullName: z.string(),
  email: z.string().email(),
  phone: z.string(),
  company_name: z.string(),
  pronouns: z.array(z.string()),
});

function Page() {
  const integrationApp = useIntegrationApp();
  const connections = useConnections();
  const { records, isLoading } = useHubspotRecords();
  const { toast } = useToast();

  console.log(records);

  useEffect(() => {
    if (connections.items.length === 0 && connections.loading === false) {
      integrationApp.open({});
    }
  }, [integrationApp, connections.items.length, connections.loading]);

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

  const onSubmit = async (data: z.infer<typeof createContactSchema>) => {
    const { pronouns, ...otherFields } = data;

    try {
      const actionResponse = await integrationApp
        .connection("hubspot")
        .action("create-contact")
        .run({
          ...otherFields,
          pronouns: pronouns.join(","),
        });

      const resultData = actionResponse?.logs?.[1]?.data?.response?.data;

      console.log(resultData);

      toast({
        title: "You submitted the following values:",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">{JSON.stringify(data, null, 2)}</code>
          </pre>
        ),
      });
    } catch (e) {
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
    <div className="flex flex-col items-center justify-center px-4 h-screen overflow-y-hidden pb-10">
      <div className="flex flex-col h-full w-[600px]">
        <header className="py-10 w-full flex items-center justify-center">
          <Image alt="logo" src="logo.svg" width={50} height={50} />
        </header>

        <div className="flex justify-between mb-4">
          <div className="flex items-center gap-2">
            <svg
              width="30"
              height="30"
              viewBox="0 0 30 30"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clip-path="url(#clip0_22_2)">
                <path
                  d="M22.5275 10.1552V6.63208C22.993 6.41448 23.3872 6.06912 23.6642 5.6362C23.9411 5.20327 24.0894 4.7006 24.0918 4.18668V4.10584C24.0918 2.60744 22.8771 1.39274 21.3788 1.39274H21.2978C19.7994 1.39274 18.5847 2.60744 18.5847 4.10584V4.18668C18.5871 4.7006 18.7354 5.20327 19.0123 5.6362C19.2893 6.06912 19.6835 6.41448 20.149 6.63208V10.1552C18.8109 10.3602 17.5507 10.915 16.496 11.7636L6.83354 4.23755C6.90243 3.98883 6.93838 3.73306 6.94244 3.47634C6.94362 2.87169 6.76544 2.28027 6.43046 1.77689C6.09547 1.27351 5.61872 0.880787 5.0605 0.648398C4.50229 0.416008 3.88769 0.354393 3.29446 0.471344C2.70122 0.588295 2.15599 0.87856 1.72775 1.30542C1.2995 1.73228 1.00747 2.27656 0.888591 2.86942C0.769716 3.46227 0.829338 4.07706 1.05992 4.63603C1.29049 5.19499 1.68167 5.67302 2.18396 6.00964C2.68625 6.34625 3.27709 6.52634 3.88174 6.52712C4.41071 6.52463 4.92976 6.38341 5.38707 6.11757L14.9018 13.5215C13.1525 16.164 13.1993 19.608 15.0197 22.2022L12.1258 25.0969C11.8917 25.0222 11.6482 24.9824 11.4025 24.979C10.0166 24.9802 8.89386 26.1042 8.89422 27.4901C8.89458 28.8759 10.0181 29.9993 11.4039 29.9996C12.7898 30 13.9137 28.8772 13.9149 27.4913C13.9117 27.2458 13.8719 27.0021 13.797 26.7682L16.6598 23.9043C19.2178 25.8735 22.731 26.0432 25.467 24.3296C28.2028 22.6159 29.5834 19.3808 28.9279 16.2199C28.2724 13.0589 25.7191 10.6398 22.5275 10.1552ZM21.3408 21.7426C20.8119 21.7568 20.2855 21.6649 19.7927 21.4724C19.2999 21.2798 18.8507 20.9904 18.4716 20.6214C18.0925 20.2523 17.7912 19.8111 17.5854 19.3236C17.3797 18.8362 17.2736 18.3125 17.2736 17.7834C17.2736 17.2543 17.3797 16.7306 17.5854 16.2431C17.7912 15.7557 18.0925 15.3144 18.4716 14.9454C18.8507 14.5763 19.2999 14.287 19.7927 14.0944C20.2855 13.9018 20.8119 13.8099 21.3408 13.8242C23.4722 13.8988 25.1618 15.6477 25.163 17.7805C25.1639 19.9131 23.4761 21.6638 21.3448 21.7406"
                  fill="#FF7A59"
                />
              </g>
              <defs>
                <clipPath id="clip0_22_2">
                  <rect width="30" height="30" fill="white" />
                </clipPath>
              </defs>
            </svg>

            <h3 className="text-2xl font-bold">Hubspot Records</h3>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="rounded-full">
                Create Record
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
                <form
                  className="space-y-4"
                  onSubmit={form.handleSubmit(onSubmit)}
                >
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
                            setValue={(value) =>
                              form.setValue("pronouns", value)
                            }
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
                  <Button type="submit">Submit</Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-2 w-full overflow-y-auto pb-20 flex-1 hide-scroolbar ">
          {isLoading ? (
            <Spinner />
          ) : (
            records?.map((record) => (
              <UserCard
                key={record.id}
                fullName={record.name}
                companyName={record?.fields?.company}
                email={record.fields.email}
                phone={record.fields.phone}
                pronouns={record.fields.salutation?.split(",").join("/")}
                avatarUrl=""
              />
            ))
          )}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 p-4">
        <UserButton />
      </div>
    </div>
  );
}

export default Page;
