import { AxiosError } from "axios";
import { useActionData } from "react-router";
import { ErrorObj } from "../types";

export function extractDate(date: Date | null) {
  if (date) {
    return String(date).split('T')[0];
  }
  return null;
}

export function getStatusCodeError() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const error = useActionData() as AxiosError;
  const errorResponse = error ? (error.response?.data as ErrorObj) : null;

  return errorResponse
}