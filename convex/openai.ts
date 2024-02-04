"use node";

import OpenAI from "openai";
import { action } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { api } from "./_generated/api";

// Initialize the OpenAI client with the given API key
const apiKey = process.env.OPENAI_API_KEY!;
const openai = new OpenAI({ apiKey });

export const generate = action({
  args: { messageBody: v.string() },
  handler: async (ctx, { messageBody }) => {
    const response = await openai.chat.completions.create({
      response_format: { type: "json_object" },
      model: "gpt-3.5-turbo-1106",
      messages: [
        {
          // Provide a 'system' message to give GPT context about how to respond
          role: "system",
          content:
            "You are a bot that generates user submission forms. You only respond in a JSON format. Each entry in the JSON is a form element. You must respond with a list of at least 8 elements. Each element is an object with a 'type' field and an 'extraAttributes' field. The 'type' field is a string and the 'extraAttributes' field is an object. The 'type' field can be 'TextField', 'TitleField', 'SubtitleField', 'ParagraphField', 'NumberField', 'TextAreaField', 'DateField', 'SelectField', or a 'CheckboxField'. The 'extraAttributes' field is an object whose properties vary based on the 'type' field. Here is an example of a form in JSON format that uses all of the fields available: {'elements':[{'type':'TitleField','extraAttributes':{'title':'Form Title'}},{'type':'SubtitleField','extraAttributes':{'subtitle':'Subtitle'}},{'type':'ParagraphField','extraAttributes':{'text':'Long paragraph text here'}},{'type':'TextField','extraAttributes':{'label':'Name','helperText':'Enter your name','required':true,'placeholder':'e.g. John'}},{'type':'DateField','extraAttributes':{'label':'Birthday','helperText':'We may need it','required':false}},{'type':'NumberField','extraAttributes':{'label':'Seats Needed','helperText':'You may have many','required':false,'placeholder':''}},{'type':'SelectField','extraAttributes':{'label':'Shirt Size','helperText':'','required':true,'placeHolder':'Select your size','options':['XS','S','M','L','XL']}},{'type':'CheckboxField','extraAttributes':{'label':'I confirm','helperText':'','required':true}},{'type':'TextAreaField','extraAttributes':{'label':'Additional Comments','helperText':'Anything more','required':false,'placeholder':'','rows':5}}]}",
        },
        {
          // Pass on the chat user's message to GPT
          role: "user",
          content: messageBody,
        },
      ],
    });

    if (response === undefined) {
      throw new ConvexError("No response from GPT-3.5");
    }

    const choices = response.choices;
    const choice = choices[0];

    if (choice === undefined) {
      throw new ConvexError("No choice from GPT-3.5");
    }

    const message = choice.message;
    const messageContent = message.content;
    return messageContent;
  },
});
