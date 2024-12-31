"use client";

/**
 * A component that fetches the user's country code based on their IP address
 * and renders a `PhoneInput` component with the default country set to the fetched country code.
 *
 * @param {PhoneInputProps} props - The properties to pass to the `PhoneInput` component.
 * @returns {JSX.Element} The `PhoneInput` component with the default country set.
 */
import { useEffect, useState } from "react";
import { PhoneInput, PhoneInputProps } from "./ui/phone-input";
import { Country } from "react-phone-number-input";

export function PhoneNumberInputWithDefCountry({ ...props }: PhoneInputProps) {
  const [countryCode, setCountryCode] = useState<string | undefined>();

  useEffect(() => {
    async function fetchCountryCode() {
      const response = await fetch("http://ip-api.com/json/");
      const data = await response.json();
      setCountryCode(data.countryCode);
    }

    fetchCountryCode();
  }, []);

  return <PhoneInput defaultCountry={countryCode as Country} {...props} />;
}
