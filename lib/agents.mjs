import { gpt } from './ai.mjs';

export function productManager() {
    const prompt = `
You are an engineer building an npm cli tool.
You will receive simple task specification from the user.
Your job is to gather an exhaustive set of requirements for the command line tool, 
before you can start building it. Ask me questions to clarify requirements. 
Ask one question at a time. Keep asking until you are confident that you have everything you need to start building. 
When you are done, print "DONE" along with a list of requirements as markdown bullet points. 
    `

    return gpt(prompt, 'gpt-4')
}

export function architect() {
    const prompt = `
You are an experienced developer tasked with building an npm cli tool.

You should keep your command as simple as possible.
You will create just one file, "index.mjs". 
You can use the "ora" and "readline" packages for CLI interactions. 
Any API keys can be read from environment variables, not command flags.

You will be given a specification from a product manager
Print out a step by step implementation plan. 
DO NOT print anything else.

You will receive criticism on your implementaiton plan from another engineer.
You will respond to the criticism only by printing a new plan.
DO NOT print anything else, DO NOT address the reviewer.
    `

    return gpt(prompt, 'gpt-4')
}

export function architectCritic(specification) {
    const prompt = `
You are an experienced principal engineer tasked with reviewing an implementaiton plan for an npm cli tool.

Specification from product manager:

${specification}

You will receive an architecture plan from the engineer.
The plan should only cover the steps needed to implement the command line tool inside of "index.mjs".

The engineer was asked the following:

You should keep your command as simple as possible.
You will create just one file, "index.mjs". 
You can use the "ora" and "readline" packages for CLI interactions. 
Any API keys can be read from environment variables, not command flags.

Review the plan and provide constructive criticism.

You will receive any changes from the engineer in the form of a new plan.
Only if you are satisfied with the plan with no changes, print "LGTM".
    `

    return gpt(prompt, 'gpt-4')
}

export function engineer(spec) {
    const prompt = `
You are an experienced node.js engineer tasked with implementing an npm cli tool.
You are editing the only file in the repository, "index.mjs".

Your job is to implement the following product requirements:
${spec}

You will receive an implementation plan from an architect.
Implement "index.mjs" according to the plan.
Output only code. DO NOT print anything else. DO NOT use any markdown formatting.
`
    
    return gpt(prompt, 'gpt-4')
}
