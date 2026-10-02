import { apiClient } from "@/lib/api/client"
import { InitiatePaymentRequest } from "@/lib/api/types/payments"

export async function getPaymentByBooking(bookingId: string) {
  const { data, error } = await apiClient.GET(
    "/api/v1/payments/by-booking/{bookingId}",
    { params: { path: { bookingId } } }
  )
  if (error) throw error
  return data
}

export async function initiatePayment(body: InitiatePaymentRequest) {
  const { data, error } = await apiClient.POST("/api/v1/payments", { body })
  if (error) throw error
  return data
}

export async function refundPayment(paymentId: string) {
  const { error } = await apiClient.POST(
    "/api/v1/payments/{paymentId}/refund",
    {
      params: { path: { paymentId } },
    }
  )
  if (error) throw error
}

/*
type InitiatePaymentRequest = {
    bookingId?: string; // uuid
}

type PaymentStatus = "Pending" | "Succeeded" | "Failed" | "Refunded"
// Pending: initiated, awaiting provider confirmation
// Succeeded: payment captured successfully
// Failed: payment attempt failed/was declined
// Refunded: a previously succeeded payment was refunded

// Responses

type GetPaymentByBookingResponse = PaymentResponse
type PaymentResponse = {
    id?: string; // uuid
    bookingId?: string; // uuid
    amountValue?: number; // double
    amountCurrency?: string | null;
    status?: PaymentStatus;
    createdOnUtc?: string; // date-time
    processedOnUtc?: string | null; // date-time
}

type InitiatePaymentResponse = {
    paymentId?: string; // uuid
    clientSecret?: string | null;
}

type RefundPaymentResponse = void // 204 No Content

// Note: /api/v1/payments/webhook is a provider-to-server webhook endpoint,
// not meant to be called from the client — intentionally omitted here.
*/
