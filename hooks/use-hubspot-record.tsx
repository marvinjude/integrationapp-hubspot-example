import { useIntegrationApp } from "@integration-app/react";
import useSWR from "swr";

export interface HubspotRecord {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  company_name: string;
  createdAt: string;
  pronouns: string;
  uri: string;
}

export function useHubspotRecords(
  { enabled }: { enabled?: boolean } = {
    enabled: true,
  }
) {
  const integrationApp = useIntegrationApp();

  const { data, error, isLoading, mutate } = useSWR(
    enabled ? "records" : null,
    async () => {
      const actionResponse = (await integrationApp
        .connection("hubspot")
        .action("list-data-records")
        .run()) as {
        output: {
          records: {
            id: string;
            name: string;
            fields: {
              email: string;
              phone: string;
              salutation: string;
              company: string;
            };
            createdTime: string;
            uri: string;
          }[];
        };
      };

      return actionResponse.output.records.map((record) => ({
        id: record.id,
        fullName: record.name,
        email: record.fields.email,
        phone: record.fields.phone,
        createdAt: record.createdTime,
        pronouns: record.fields.salutation,
        company_name: record.fields.company,
        uri: record.uri,
      })) as HubspotRecord[];
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateOnMount: true,
    }
  );

  return {
    records: data,
    error,
    isLoading,
    mutate,
  };
}
