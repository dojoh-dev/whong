const main = async () => {
  await Promise.all([import('./server'), import('./bot')]);
};

main();
