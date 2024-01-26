import OpenAI from 'openai';
import ora from 'ora';

const openai = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY'], 
});

class GptAgent {
  constructor(systemPrompt, model='gpt-3.5-turbo') {
    this.systemPrompt = systemPrompt;
    this.model = model;
    this.messages = []; 
    this.error = null;
  }

  setCliAction(updateMessage) {
    this.cliUpdateMsg = updateMessage;
  }

  async send(message) {
    let spinner
    if (this.cliUpdateMsg) {
      spinner = ora(this.cliUpdateMsg).start();
    }
    this.messages.push({ role: 'user', content: message });
    try {
      const chatCompletion = await openai.chat.completions.create({
        messages: [{ role: 'system', content: this.systemPrompt }, ...this.messages],
        model: this.model
      });
      const reply = chatCompletion.choices[0].message.content;
      this.reply = reply;
      this.messages.push({ role: 'assistant', content: reply });
      if (spinner) {
        spinner.succeed(`Success: ${this.cliUpdateMsg}`);
      }
      return this
    } catch(e) {
      this.error = e;
      this.reply = null
      // Remove last message
      this.messages.pop();
      if (spinner) {
        spinner.fail(`Failed: ${this.cliUpdateMsg}`);
      }
      return this;
    }
  }
}

export function gpt(systemPrompt, model='gpt-3.5-turbo') {
  return new GptAgent(systemPrompt, model);
}