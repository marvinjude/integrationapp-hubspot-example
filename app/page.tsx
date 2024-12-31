"use client";

import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
import { useEffect } from "react";
import { useConnections, useIntegrationApp } from "@integration-app/react";

import { Spinner } from "@/components/ui/spinner";
import { UserCard } from "@/components/user-card";
import { useHubspotRecords } from "@/hooks/use-hubspot-record";
import { HubspotIcon } from "@/icons/hubspot";
import Link from "next/link";
import { CreateContactDialog } from "@/components/create-contact-dialog";

function Page() {
  const integrationApp = useIntegrationApp();
  const connections = useConnections();
  const { records, isLoading } = useHubspotRecords();

  useEffect(() => {
    if (connections.items.length === 0 && connections.loading === false) {
      integrationApp.open({});
    }
  }, [integrationApp, connections.items.length, connections.loading]);

  return (
    <div className="flex flex-col items-center h-screen overflow-y-hidden pb-2">
      <div className="flex-1 shrink-0 flex flex-col h-full w-[600px]">
        <header className="py-10 w-full flex items-center justify-center">
          <Image alt="logo" src="logo.svg" width={50} height={50} />
        </header>
        <div className="flex justify-between mb-4">
          <div className="flex items-center gap-2">
            <HubspotIcon />
            <h3 className="text-2xl font-bold">Contacts</h3>
          </div>
          {records && records.length > 0 && (
            <CreateContactDialog records={records} />
          )}
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center h-full w-full">
            <Spinner />
          </div>
        ) : records?.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-full w-full">
            <HubspotIcon />
            <h1 className="text-2xl font-bold">No contacts yet</h1>
            <h1 className="text-gray-500  py-2">
              Your contacts will appear here once you create them
            </h1>
            <CreateContactDialog records={records} />
          </div>
        ) : (
          <div className="space-y-2 w-full overflow-y-auto pb-20 flex-1 hide-scroolbar">
            {records?.map((record) => (
              <UserCard
                createdAt={record.createdAt}
                uri={record.uri}
                key={record.id}
                fullName={record.fullName}
                companyName={record.company_name}
                email={record.email}
                phone={record.phone}
                pronouns={record.pronouns}
                avatarUrl=""
              />
            ))}
          </div>
        )}
        <div className="flex items-center justify-center text-xs text-gray-500 gap-1 font-semibold">
          Built with ❤️ by
          <Link
            className="text-blue-500"
            href="https://linkedin.com/in/jude-agboola"
          >
            Jude
          </Link>
          using
          <Link className="text-blue-500" href="https://integration.app">
            integration.app
          </Link>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 p-4">
        <UserButton />
      </div>
    </div>
  );
}

export default Page;
