(() => {
  const machine = document.querySelector('.gift-machine');
  const ballsTray = machine?.querySelector('.gift-machine__balls');
  const knob = machine?.querySelector('.gift-machine__knob');
  const prize = machine?.querySelector('.gift-machine__prize');
  const status = machine?.querySelector('.gift-machine__status');
  const reward = document.querySelector('.pokemon-reward');
  const rewardCard = reward?.querySelector('.pokemon-reward__card');
  const rewardImage = reward?.querySelector('.pokemon-reward__sticker');
  const rewardTitle = reward?.querySelector('.pokemon-reward__title');
  if (!machine || !ballsTray || !knob || !prize || !status || !reward || !rewardCard || !rewardImage || !rewardTitle) return;

  const ballPositions = [
    [-9.5, 26.5, 36], [8, 17, 36], [0.8, 0, 0], [21.5, 0, 0],
    [25, 15.3, 36], [6, 34.8, 36], [-4.3, 55.7, 36], [20.5, 62.4, 0],
    [40.5, 62.7, 0], [61.2, 62.7, 0], [80.2, 62.7, 0], [25.8, 33.5, 36], [45.7, 26.5, 36]
  ];
  const ballImages = ballPositions.map((position, index) => {
    const image = document.createElement('img');
    image.src = `public/assets/parting-ball-${String(index + 1).padStart(2, '0')}.svg`;
    image.alt = '';
    image.draggable = false;
    image.style.setProperty('--ball-x', `${position[0]}%`);
    image.style.setProperty('--ball-y', `${position[1]}%`);
    image.style.setProperty('--ball-rotate', `${position[2]}deg`);
    ballsTray.append(image);
    return image;
  });

  const pokemon = [
    { name: 'Bulbasaur', image: 'pokemon-bulbasaur.png' },
    { name: 'Charmander', image: 'pokemon-charmander.png' },
    { name: 'Squirtle', image: 'pokemon-squirtle.png' },
    { name: 'Pikachu', image: 'pokemon-pikachu.png' },
    { name: 'Jigglypuff', image: 'pokemon-jigglypuff.png' },
    { name: 'Meowth', image: 'pokemon-meowth.png' },
    { name: 'Gengar', image: 'pokemon-gengar.png' },
    { name: 'Eevee', image: 'pokemon-eevee.png' },
    { name: 'Mewtwo', image: 'pokemon-mewtwo.png' },
    { name: 'Mew', image: 'pokemon-mew.png' }
  ];

  const setState = (state, message) => {
    machine.dataset.state = state;
    status.textContent = message;
    knob.disabled = state !== 'ready';
    prize.disabled = state !== 'collected';
  };

  knob.addEventListener('click', () => {
    if (machine.dataset.state !== 'ready') return;
    setState('turning', 'Your gift is on its way…');
    window.setTimeout(() => {
      if (machine.dataset.state !== 'turning') return;
      setState('dispensing', 'A little surprise just dropped. Tap the ball!');
      const selectedBall = ballImages[10];
      if (selectedBall) selectedBall.hidden = true;
      window.setTimeout(() => {
        if (machine.dataset.state === 'dispensing') setState('collected', 'Tap the ball to open your Pokémon gift.');
      }, 620);
    }, 420);
  });

  const closeReward = () => {
    if (reward.hidden) return;
    reward.hidden = true;
    document.body.classList.remove('has-pokemon-reward');
    rewardImage.removeAttribute('src');
    ballImages.forEach((ball) => { ball.hidden = false; });
    setState('ready', 'Turn the knob for another little surprise.');
    knob.focus();
  };

  prize.addEventListener('click', () => {
    if (machine.dataset.state !== 'collected') return;
    const picked = pokemon[Math.floor(Math.random() * pokemon.length)];
    rewardImage.src = `public/assets/${picked.image}`;
    rewardImage.alt = `${picked.name} Pokémon sticker`;
    rewardTitle.textContent = picked.name;
    reward.hidden = false;
    document.body.classList.add('has-pokemon-reward');
    rewardCard.focus({ preventScroll: true });
  });

  reward.addEventListener('click', (event) => {
    if (event.target.closest('[data-reward-dismiss]')) closeReward();
  });
  document.addEventListener('keydown', (event) => {
    if (reward.hidden) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      closeReward();
      return;
    }
    if (event.key !== 'Tab') return;
    const focusable = [...rewardCard.querySelectorAll('button:not(:disabled)')];
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
})();
