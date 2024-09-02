const ATTACK_VALUE = 10;
const STRONG_ATTACK_VALUE = 17;

const MONSTER_ATTACK_VALUE = 14;
const HEAL_VALUE = 20;

const MODE_ATTACK = "ATTACK";
const MODE_STRONG_ATTACK = "STRONG_ATTACK";
const LOG_EVENT_PLAYER_ATTACK = "PLAYER-ATTACK";
const LOG_EVENT_PLAYER_STRONG_ATTACK = "PLAYER_STRONG_ATTACK";
const LOG_EVENT_MONSTER_ATTACK = "MONSTER-ATTACK";
const LOG_EVENT_PLAYER_HEAL = "PLAYER_HEAL";
const LOG_EVENT_GAME_OVER = "GAME_OVER";

const enteredValue = prompt("Maximum Life for you and Monster", "100");

let chosenMaxLife = +enteredValue;
if (isNaN(chosenMaxLife) || chosenMaxLife <= 0) {
  chosenMaxLife = 100;
}
let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
let hasBonusLife = true;
let battleLog = [];

//monster-health

const monsterHealthbar = document.getElementById("monster-health");
const playerHealthbar = document.getElementById("player-health");
const bonusLife = document.getElementById("health");

const attackBtn = document.getElementById("attack");
const strongAttackBtn = document.getElementById("strong-attack");
const healBtn = document.getElementById("heal");
const logBtn = document.getElementById("show-log");

const adjustHealthBars = (maxlife) => {
  console.log(monsterHealthbar, "", maxlife);
  monsterHealthbar.max = maxlife;
  monsterHealthbar.value = maxlife;
  playerHealthbar.max = maxlife;
  playerHealthbar.value = maxlife;
};

const dealMonsterDamage = (damage) => {
  const dealtDamage = Math.random() * damage;
  monsterHealthbar.value = +monsterHealthbar.value - dealtDamage;
  return dealtDamage;
};
const dealPlayerDamage = (damage) => {
  const dealtDamage = Math.random() * damage;
  playerHealthbar.value = +playerHealthbar.value - dealtDamage;
  return dealtDamage;
};

const increasePlayerHealth = (healValue) => {
  playerHealthbar.value = +playerHealthbar.value + healValue;
};

const resetGame = (value) => {
  playerHealthbar.value = value;
  monsterHealthbar.value = value;
};

const removeBonusLife = () => {
  bonusLife.parentElement.removeChild(bonusLife);
};

const setPlayerHealth = (health) => {
  playerHealthbar.value = health;
};

const showOutput = (message) => {
  const Message = document.getElementById("result");
  const MessageText = document.getElementById("result-text");

  console.log(message, MessageText, Message);

  if (message) {
    Message.classList.add("add");
    MessageText.textContent = message;
  } else if (!message) {
    Message.classList.remove("add");
    return;
  }
};

adjustHealthBars(chosenMaxLife);

const writeToLog = (event, value, monsterHealth, playerHealth) => {
  let logEntry = {
    event: event,
    value: value,
    target: "Monster",
    finalMonsterHealth: monsterHealth,
    finalPlayerHealth: playerHealth,
  };
  if (event === LOG_EVENT_PLAYER_ATTACK) {
    logEntry.target = "MONSTER";
  } else if (event === LOG_EVENT_PLAYER_STRONG_ATTACK) {
    logEntry.target = "MONSTER";
  } else if (event === LOG_EVENT_MONSTER_ATTACK) {
    logEntry.target = "PLAYER";
  } else if (event === LOG_EVENT_PLAYER_HEAL) {
    logEntry.target = "PLAYER";
  }
  //else if (event === LOG_EVENT_GAME_OVER) {
  //     logEntry = {
  //       event: event,
  //       value: value,
  //       finalMonsterHealth: monsterHealth,
  //       finalPlayerHealth: playerHealth,
  //     };
  //   }
  battleLog.push(logEntry);
};

const reset = () => {
  currentMonsterHealth = chosenMaxLife;
  currentPlayerHealth = chosenMaxLife;
  resetGame(chosenMaxLife);
};

const endRound = () => {
  const initialPlayerHealth = currentPlayerHealth;
  const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
  currentPlayerHealth -= playerDamage;

  let message;
  writeToLog(
    LOG_EVENT_MONSTER_ATTACK,
    playerHealthbar,
    currentMonsterHealth,
    currentPlayerHealth
  );

  if (currentPlayerHealth <= 0 && hasBonusLife) {
    hasBonusLife = false;
    removeBonusLife();
    currentPlayerHealth = initialPlayerHealth;

    setPlayerHealth(initialPlayerHealth);
    showOutput("BONUS Life Used!.");
  }
  if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
    message = "You Won!!";
    writeToLog(
        LOG_EVENT_GAME_OVER,
        'PLAYER WON',
        currentMonsterHealth,
        currentPlayerHealth
      );
    // alert(message);
    showOutput(message);
  } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
    message = "You Lost & Monster Won";
    writeToLog(
        LOG_EVENT_GAME_OVER,
        'You Lost & Monster Won',
        currentMonsterHealth,
        currentPlayerHealth
      );
    // alert(message);
    showOutput(message);
  } else if (currentPlayerHealth <= 0 && currentMonsterHealth <= 0) {
    message = "You Have A Draw";
    writeToLog(
        LOG_EVENT_GAME_OVER,
        'You Have A Draw',
        currentMonsterHealth,
        currentPlayerHealth
      );
    // alert(message);
    showOutput(message);
  }

  if (currentMonsterHealth <= 0 || currentPlayerHealth <= 0) {
    reset();
  }
};

const attackMonster = (mode) => {
  const maxDamage=mode===MODE_ATTACK?ATTACK_VALUE:STRONG_ATTACK_VALUE;
  const logEvent=mode===MODE_ATTACK?LOG_EVENT_PLAYER_ATTACK:LOG_EVENT_PLAYER_STRONG_ATTACK;
//   if (mode === "ATTACK") {
//     maxDamage = ATTACK_VALUE;
//     logEvent=LOG_EVENT_PLAYER_ATTACK
//   } else {
//     maxDamage = STRONG_ATTACK_VALUE;
//     logEvent=LOG_EVENT_PLAYER_STRONG_ATTACK
//   }
  const damage = dealMonsterDamage(maxDamage);
  currentMonsterHealth -= damage;

  writeToLog(
    logEvent,
    maxDamage,
    currentMonsterHealth,
    currentPlayerHealth
  );
  // Monster Hits Back

  endRound();
};

const attackHandler = () => {
  attackMonster(MODE_ATTACK);
};

const strongAttackHandler = () => {
  attackMonster(MODE_STRONG_ATTACK);
};

const healPlayerHandler = () => {
  let healValue;

  if (currentPlayerHealth >= chosenMaxLife - HEAL_VALUE) {
    showOutput("You Cant Heal To More Than Your Max initial Health.");
    healValue = chosenMaxLife - currentPlayerHealth;
  } else {
    healValue = HEAL_VALUE;
  }
  increasePlayerHealth(HEAL_VALUE);
  currentPlayerHealth += HEAL_VALUE;
  writeToLog(
    LOG_EVENT_PLAYER_HEAL,
    healValue,
    currentMonsterHealth,
    currentPlayerHealth
  );

  endRound();
};
const printLogHandler = () => {
  console.log(battleLog);
};

attackBtn.addEventListener("click", attackHandler);
strongAttackBtn.addEventListener("click", strongAttackHandler);
healBtn.addEventListener("click", healPlayerHandler);
logBtn.addEventListener("click", printLogHandler);
