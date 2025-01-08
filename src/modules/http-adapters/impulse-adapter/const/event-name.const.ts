export const EVENT_NAME = {
  INVITE: 'install',
  PURCHASE: 'purchase',
} as const;

export type EventName = (typeof EVENT_NAME)[keyof typeof EVENT_NAME];
