const readline = require('readline');
const chalk = require('chalk');
const { getAIResponse, resetHistory } = require('./ai');
const { CHARACTER_DATA } = require('./character');

// ============================================
//  🎨 COLORS & CONFIG
// ============================================
const PRIMARY = chalk.hex('#ef7065');
const SECONDARY = chalk.hex('#facc90');
const DIM = chalk.dim;
const BOLD = chalk.bold;

const SESSION_ID = 'cli-session';

const mockMsg = {
  from: {
    username: 'branzcreed',
    first_name: 'Bran-kun',
  },
  chat: { id: SESSION_ID },
};

// ============================================
//  🖥️ CLI FUNCTIONS
// ============================================

function clearScreen() {
  process.stdout.write('\x1Bc');
}

function printDivider() {
  console.log(DIM('─'.repeat(60)));
}

function showWelcome() {
  clearScreen();
  console.log('');
  console.log(PRIMARY('  ╭ ') + PRIMARY.bold('Welcome to ') + SECONDARY.bold('Eatsuki CLI') + PRIMARY.bold(' v1.0'));
  console.log(PRIMARY('  │'));
  console.log(PRIMARY('  ├ ') + DIM('Nakano Itsuki — AI Terminal Chat'));
  console.log(PRIMARY('  ├ ') + DIM('Powered by Groq AI & avttr-studio'));
  console.log(PRIMARY('  ╰'));
  console.log('');
  printDivider();
  console.log('');
  console.log(SECONDARY('  Tips:'));
  console.log(DIM('  • Type any message to chat with Itsuki'));
  console.log(DIM('  • Type ') + BOLD('/reset') + DIM(' to clear chat history'));
  console.log(DIM('  • Type ') + BOLD('/clear') + DIM(' to clear the screen'));
  console.log(DIM('  • Type ') + BOLD('exit') + DIM(' to quit'));
  console.log('');
  printDivider();
  console.log('');
}

/**
 * Menampilkan loading animation sederhana (tanpa ora)
 */
function startLoading() {
  const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
  let i = 0;
  return setInterval(() => {
    process.stdout.write(`\r  ${PRIMARY(frames[i])} ${DIM('Itsuki is thinking...')}`);
    i = (i + 1) % frames.length;
  }, 80);
}

function stopLoading(interval) {
  clearInterval(interval);
  process.stdout.write('\r' + ' '.repeat(50) + '\r');
}

/**
 * Membaca satu baris input dari user (Promise-based)
 */
function askQuestion(rl) {
  return new Promise((resolve) => {
    rl.question(SECONDARY.bold('  > '), (answer) => {
      resolve(answer);
    });
  });
}

// ============================================
//  🚀 MAIN LOOP
// ============================================

async function main() {
  process.on('uncaughtException', (err) => {
    console.log(chalk.red(`\n  ✗ Error: ${err.message}\n`));
  });

  showWelcome();

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.on('close', () => {
    console.log('');
    console.log(PRIMARY('  Ja-ne, Bran-kun! 🌟'));
    console.log('');
    process.exit(0);
  });

  // Main loop — keep going until user types exit
  while (true) {
    let input;
    try {
      input = await askQuestion(rl);
    } catch {
      break;
    }

    const trimmed = (input || '').trim();
    if (!trimmed) continue;

    // Exit
    if (trimmed.toLowerCase() === 'exit' || trimmed.toLowerCase() === 'quit') {
      console.log('');
      console.log(PRIMARY('  Ja-ne, Bran-kun! Don\'t forget to eat, okay~ 🍖'));
      console.log('');
      process.exit(0);
    }

    // Reset
    if (trimmed === '/reset') {
      resetHistory(SESSION_ID);
      console.log('');
      console.log(DIM('  ✓ Chat history has been reset'));
      console.log('');
      continue;
    }

    // Clear
    if (trimmed === '/clear') {
      showWelcome();
      continue;
    }

    // AI Response
    console.log('');
    const loader = startLoading();

    try {
      const response = await getAIResponse(SESSION_ID, trimmed, mockMsg);
      stopLoading(loader);

      console.log(PRIMARY.bold('  Itsuki'));
      console.log('');

      const lines = response.split('\n');
      lines.forEach(line => {
        console.log('  ' + line);
      });

      console.log('');
      printDivider();
      console.log('');
    } catch (error) {
      stopLoading(loader);
      console.log(chalk.red(`  ✗ Error: ${error.message || 'Gomen, something went wrong.'}`));
      console.log('');
    }
  }
}

main();
