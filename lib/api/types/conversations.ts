import type { components, operations, paths } from "../generated/api"
import { QueryParameters } from "../type-utils"

export type Schemas = components["schemas"]
export type Operations = operations
export type ApiPaths = paths

export type GetConversationMessagesQuery = QueryParameters<
  "/api/v1/conversations/{id}/messages",
  "get"
>

export type MyConversationResponse =
  Schemas["StayHub.Application.Conversations.GetMyConversations.MyConversationResponse"]

export type ConversationMessagesResponse =
  Schemas["StayHub.Application.Conversations.GetConversationMessages.ConversationMessagesResponse"]

export type StartConversationRequest =
  Schemas["StayHub.Api.Endpoints.Conversations.StartConversationRequest"]

export type SendMessageRequest =
  Schemas["StayHub.Api.Endpoints.Conversations.SendMessageRequest"]
