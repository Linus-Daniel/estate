import { Details } from "./types";
import { Building, Logs } from "lucide-react";

export const details: Details[] = [
  {
    title: "Total Properties",
    icon: Building,
    value: 30,
    color: "#01c1ef",
  },
  {
    title: "Occupied Properties",
    icon: Building,
    value: 14,
    color: "#dc4b38",
  },
  {
    title: "Vacant Properties",
    icon: Building,
    value: 14,
    color: "#01a65b",
  },
  {
    title: "Unpaid Invoice",
    icon: Logs,
    value: 14,
    color: "#f39d13",
  },
];

export const form = [
    {
      name: "email",
      label: "Email Id",
      placeholder: "Enter your email",
    },
    {
      name: "name",
      label: "Name",
      placeholder: "Enter your name",
    },
    {
      name: "contact",
      label: "Contact No.",
      placeholder: "Enter your phone number",
    },
    {
      name: "address",
      label: "Address",
      placeholder: "Enter your address",
    },
  ];
  