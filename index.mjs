#!/usr/bin/env node
import ora from 'ora';
import { createInterface } from 'readline';
import { architect, architectCritic, engineer, productManager } from './lib/agents.mjs'

async function main() {
  const askQuestion = (question) => {
    const readline = createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    return new Promise((resolve) => {
      readline.question("> " + question + "\n\ntype your answer: ", (ans) => {
        readline.close();
        resolve(ans);
      });
    });
  }

  let pm = productManager();
  pm.setCliAction('👩‍💼 Anne (pm) is thinking about user requirements...')
  const task = await askQuestion("What would you like to build?")
  pm = await pm.send(task);
  if (pm.error) {
    console.log(pm.error);
    return;
  }

  let spec = ``
  pm.setCliAction('👩‍💼 Anne (pm) is thinking about your answer...')
  while(true) {
    if (spec !== '') {
      break;
    }

    const answer = await askQuestion(pm.reply);
    pm = await pm.send(answer);
    if (pm.error) {
      console.log(pm.error)
      break;
    }
    if (pm.reply.indexOf('DONE') > -1) {
      spec = pm.reply;
      spec.replace('DONE', '');
      break;
    }
  }

  const arch = architect(spec);
  arch.setCliAction('👨 Ross (jr. architect) is working on the implementation plan...')

  const critic = architectCritic(spec);
  critic.setCliAction('👨‍💻 Bob (sr. architect) is reviewing the plan...')

  let implementationPlan = ``

  while (true) {
    if (implementationPlan !== '') {
      break;
    }

    await arch.send(critic.reply ? critic.reply : spec)
    if (arch.error) {
      console.log(arch.error);
      return;
    }

    await critic.send(arch.reply)
    if (critic.error) {
      console.log(critic.error);
      return;
    }

    if (critic.reply.indexOf('LGTM') > -1) {
      implementationPlan = arch.reply;
      break;
    }
  }

  const dev = engineer(spec);
  dev.setCliAction('👩‍🔧 Olga (Node.js engineer) is writing code...')
  await dev.send(implementationPlan)
  const code = dev.reply;

  // remove any line with ``` in it
  const lines = code.split('\n');
  const filteredLines = lines.filter(line => line.indexOf('```') === -1);
  const filteredCode = filteredLines.join('\n');


}

main();