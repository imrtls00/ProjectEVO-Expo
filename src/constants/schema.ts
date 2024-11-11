import { SchemaType } from "@google/generative-ai";

export const actionSchema = {
  description: "List of actions to be performed",
  type: SchemaType.ARRAY,
  items: {
    type: SchemaType.OBJECT,
    properties: {
      action: {
        type: SchemaType.STRING,
        description: "any of the following",
        enum: [
          "SummaryOfEmails",
          "SendEmail",
          "ScheduleMeeting",
          "SetAlarm",
          "TextWhatsApp",
          "Call",
          "Instagram",
          "Weather",
          "NotAvailable",
        ],
        nullable: false,
      },
      messageToShow: {
        type: SchemaType.STRING,
        description: "Response to show to the user on screen, in-case of EmailSummary Action just reply: press the button to get summary",
      },
      body: {
        type: SchemaType.STRING,
        description:
          "Message to be used for the action, such as email or message body, etc.",
      },
      subject: {
        type: SchemaType.STRING,
        description:
          "Subject or Title of the email, message, alarm, meeting, etc.",
      },
    },
    required: ["action", "messageToShow"],
  },
};
