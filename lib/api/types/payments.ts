import type { components, operations, paths } from "../generated/api"

export type Schemas = components["schemas"]
export type Operations = operations
export type ApiPaths = paths

export type PaymentStatus = Schemas["StayHub.Domain.Payments.PaymentStatus"]

export type PaymentResponse =
  Schemas["StayHub.Application.Payments.GetPaymentByBooking.PaymentResponse"]

export type InitiatePaymentRequest =
  Schemas["StayHub.Api.Endpoints.Payments.InitiatePaymentRequest"]

export type InitiatePaymentResponse =
  Schemas["StayHub.Application.Payments.InitiatePayment.InitiatePaymentResponse"]
