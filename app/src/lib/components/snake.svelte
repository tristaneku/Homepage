<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import * as Tone from 'tone';

	let { playing = $bindable(false) }: { playing: boolean } = $props();

	let ending = false;

	let canvas: HTMLCanvasElement;

	let canvasContext: CanvasRenderingContext2D | undefined;
	let synth: Tone.PolySynth | undefined;

	let innerWidth = $state(0);
	let innerHeight = $state(0);

	let blockSize = 20;
	let cell = blockSize + 1;

	let columns = $derived(Math.floor(innerWidth / cell));
	let rows = $derived(Math.floor(innerHeight / cell));

	let velocity: [number, number] = [0, 1];

	let snakeBody = $state<number[][]>([[0, 0]]);
	let food = $state<[number, number]>([10, 10]);

	let overlayCovered = $derived(food[1] < 5 * cell || snakeBody[0][1] < 5 * cell);

	let pressable = true;

	let clock: ReturnType<typeof setInterval>;

	let score = $state(0);
	let localHighscore = $state(0);
	let highscore = $state<number | undefined>();

	const sounds = {
		move: [['A3', '16n']],
		food: [
			['C4', '16n'],
			['E4', '16n']
		],
		lost: [
			['D4', '8n'],
			['C#4', '8n'],
			['C4', '8n'],
			['B3', '4n']
		],
		won: [
			['B3', '16n'],
			['D#4', '16n'],
			['F#4', '16n'],
			['D4', '16n'],
			['F#4', '16n'],
			['A4', '16n'],
			['E4', '16n'],
			['G#4', '16n'],
			['B4', '2n']
		]
	} as const;

	async function playSound(type: keyof typeof sounds) {
		if (!synth) return;

		await Tone.start();

		let time = Tone.now();
		for (const [note, duration] of sounds[type]) {
			synth.triggerAttackRelease(note, duration, time);
			time += Tone.Time(duration).toSeconds();
		}
	}

	function onkeydown(e: KeyboardEvent) {
		if (e.key.startsWith('Arrow')) e.preventDefault();
		if (!pressable) return;

		if (e.key === 'ArrowUp' && velocity[1] == 0) velocity = [0, -1];
		else if (e.key === 'ArrowDown' && velocity[1] == 0) velocity = [0, 1];
		else if (e.key === 'ArrowLeft' && velocity[0] == 0) velocity = [-1, 0];
		else if (e.key === 'ArrowRight' && velocity[0] == 0) velocity = [1, 0];
		else return;

		playSound('move');

		if (!playing) {
			playing = true;
			setClock(10);
		}

		pressable = false;
	}

	function onScroll() {
		if (playing && !ending) {
			ending = true;
			pressable = false;
			restart();
		}
	}

	function addScore() {
		score++;
		localHighscore = Math.max(localHighscore, score);

		if (highscore !== undefined) {
			highscore = Math.max(highscore, score);
		}
	}

	async function saveHighscore() {
		if (score == 0) return;

		if (score == localHighscore) {
			localStorage.setItem('local_highscore', String(localHighscore));
		}

		if (score == highscore) {
			await fetch('/api/highscore', {
				method: 'POST',
				body: JSON.stringify({ score })
			});
		}
	}

	async function getHighscore() {
		localHighscore = Number(localStorage.getItem('local_highscore') ?? 0);

		try {
			const res = await fetch('/api/highscore');
			if (!res.ok) return;

			const data = await res.json();
			if (typeof data.highscore !== 'number') return;

			highscore = data.highscore;
		} catch (e) {
			console.error("Couldn't fetch the highscore:", e);
		}
	}

	function placeFood() {
		const foodX = Math.floor(Math.random() * columns) * cell;
		const foodY = Math.floor(Math.random() * rows) * cell;

		for (const [x, y] of snakeBody) {
			if (foodX == x && foodY == y) {
				return placeFood();
			}
		}

		food = [foodX, foodY];
	}

	function move() {
		const [snakeX, snakeY] = snakeBody[0];
		const [foodX, foodY] = food;

		let newX = snakeX + cell * velocity[0];
		let newY = snakeY + cell * velocity[1];

		if (newX >= columns * cell) newX = 0;
		else if (newX < 0) newX = (columns - 1) * cell;

		if (newY >= rows * cell) newY = 0;
		else if (newY < 0) newY = (rows - 1) * cell;

		const willEat = newX == foodX && newY == foodY;
		const limit = willEat ? snakeBody.length : snakeBody.length - 1;

		for (let i = 1; i < limit; i++) {
			const [x, y] = snakeBody[i];
			if (newX == x && newY == y) {
				playSound('lost');
				finish();
				return;
			}
		}

		snakeBody.unshift([newX, newY]);

		if (willEat) {
			addScore();

			if (snakeBody.length >= columns * rows) {
				playSound('won');
				finish();
				return;
			}

			playSound('food');
			placeFood();
		} else snakeBody.pop();

		pressable = true;
	}

	function render() {
		if (!canvasContext) return;

		canvasContext.clearRect(0, 0, innerWidth, innerHeight);

		for (const [i, [x, y]] of snakeBody.entries()) {
			const lightness = 68 + (i / snakeBody.length) * 25;

			canvasContext.fillStyle = `HSL(200, 72%, ${lightness}%)`;
			canvasContext.fillRect(x, y, blockSize, blockSize);
		}

		const [foodX, foodY] = food;

		canvasContext.fillStyle = '#ebebad';
		canvasContext.fillRect(foodX, foodY, blockSize, blockSize);
	}

	function tick() {
		move();
		render();
	}

	function setClock(fps: number) {
		clearInterval(clock);
		tick();
		clock = setInterval(tick, 1000 / fps);
	}

	function reset() {
		ending = false;
		playing = false;
		pressable = true;
		score = 0;
		velocity = [0, 1];
		snakeBody = [[Math.floor((columns * 3) / 4) * cell, 0]];
		food = [Math.floor(columns / 4) * cell, Math.floor((rows * 3) / 4) * cell];

		setClock(5);
	}

	async function restart() {
		saveHighscore();

		await canvas.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200, fill: 'forwards' }).finished;
		reset();
		canvas.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200, delay: 200, fill: 'forwards' });
	}

	function finish() {
		ending = true;
		pressable = false;
		clearInterval(clock);

		setTimeout(() => restart(), 2000);
	}

	onMount(() => {
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		canvasContext = ctx;

		synth = new Tone.PolySynth(Tone.Synth, {
			oscillator: { type: 'sine' },
			envelope: { attack: 0.01, decay: 0.1, sustain: 0, release: 0.05 },
			volume: -4
		});

		const limiter = new Tone.Limiter(-3).toDestination();
		synth.connect(limiter);

		getHighscore();

		reset();

		return () => {
			clearInterval(clock);
			synth?.dispose();
		};
	});
</script>

<svelte:window bind:innerWidth bind:innerHeight {onkeydown} onscroll={onScroll} onresize={reset} />

<canvas bind:this={canvas} width={innerWidth} height={innerHeight}></canvas>

{#if playing}
	<div class="overlay" transition:fade={{ duration: 200 }} style:opacity={overlayCovered ? 0.3 : 1}>
		<div class="highscore local">
			<p>LOCAL</p>
			<p class="score">{localHighscore}</p>
		</div>

		<p class="score">{score}</p>

		<div class="highscore global">
			<p>GLOBAL</p>
			<p class="score">{highscore !== undefined ? highscore : 'UNKNOWN'}</p>
		</div>
	</div>
{/if}

<style>
	@import url('https://fonts.googleapis.com/css2?family=Micro+5&display=swap');

	canvas {
		position: absolute;
		inset: 0;
	}

	.overlay {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		padding: 20px;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: flex-end;
		transition: opacity 0.2s ease;
		font-family: 'Micro 5', sans-serif;

		.score {
			font-size: 6rem;
			margin: 0;
			text-box: trim-both cap alphabetic;
		}

		.highscore {
			display: flex;
			flex-direction: column;
			font-size: 2rem;
			gap: 2px;
		}

		.local {
			align-items: flex-start;
		}

		.global {
			align-items: flex-end;
		}
	}
</style>
