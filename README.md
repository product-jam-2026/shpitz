# Shpitz

Shpitz is a mobile first, Hebrew language game that helps people get better at spotting online scams and misleading content. Each day users get five quick challenges and decide whether a message or image is real or fake. The experience gives immediate feedback, a short tip, and builds a streak so users keep training their “scam radar.”

## The Idea
Online scams are getting smarter and more visual. Shpitz turns awareness into a daily habit:
- short, daily practice (5 questions)
- two modes: text messages and images
- hints, explanations, and review of wrong answers
- streaks and badges to keep users engaged
- easy sharing of results to invite friends

The goal is to reduce falls for phishing and social engineering by making detection skills feel simple and fun.

## Who It’s For
Older adults are the primary audience. Many didn’t grow up with the internet or smartphones, so their scam detection instincts are less developed. Because online platforms and tactics change quickly, the pace of change makes it harder to keep up, which increases vulnerability when a scam appears. Shpitz bridges that gap with short, low-pressure practice that builds confidence over time.

## Getting Started

Ensure you have a local copy of the repository, and, in your terminal, navigate
to the root of the repository.

### Install the dependencies

The codebase has libraries it depends on to run - these are refered to as
"dependencies". You need to install these dependencies before you can run the
codebase. To install the dependencies, run the following command in your
terminal:

```bash
npm install
```

### Configure local environment variables

Run the command from the root of the project:

```bash
cp .env.local.template .env.local
```

Environment variables provide a way to pass configuration to your application
without including configuration values directly in the codebase. This is useful
for things like API keys and other sensitive information that you don't want to
be publicly available.

In VS Code, open the `.env.local` file that was created. You can update the
values with real data as described in the file.

### Run the development server

The codebase uses a development server to run the code. This is a server that
runs on your local machine, and allows you to view the code in your browser. To
run the development server, run the following command in your terminal:

```bash
npm run dev
```

## View the application in your browser

Once the server is running, you can view the application in your browser. To do
this, open Chrome (or Chromium), and type the following into the address bar:

```bash
http://localhost:3000
```

## Other commands you can run

The codebase is set up with a number of commands you can run. These are defined
in the `package.json` file, in the `scripts` section. The following are
available:

**Lint your code to detect style and some syntax errors**

```bash
npm run lint
```

**Compile a production build of your app**

```bash
npm run build
```

**Run the compiled production build of the server**

```bash
npm run start
```

**Print out some system info related to your server**

```bash
npm run info
```
