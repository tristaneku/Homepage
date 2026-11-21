<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { onMount } from 'svelte';
	import { cubicInOut } from 'svelte/easing';

	const tips = ['press_arrow_keys', 'scroll_down'];

	let current = $state(0);
	let tip = $derived(tips[current]);

	onMount(() => {
		const interval = setInterval(() => {
			current = (current + 1) % tips.length;
		}, 4000);

		return () => clearInterval(interval);
	});

	function make(direction: 1 | -1, delay = 0) {
		return (_: HTMLElement) => ({
			delay,
			duration: 1000,
			easing: cubicInOut,
			css: (t: number, u: number) => `
        		transform: translateY(${20 * direction * u}px);
        		opacity: ${t};
        		filter: blur(${4 * u}px);
        	`
		});
	}

	const showIn = make(1, 400);
	const showOut = make(-1);
</script>

<div class="carousel">
	{#key tip}
		<p in:showIn out:showOut>
			{$_(tip)}
		</p>
	{/key}
</div>

<style>
	.carousel {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		display: flex;
		align-items: flex-end;
		justify-content: center;
		padding: 40px;
		transition: opacity 0.6s ease 1s;

		@starting-style {
			opacity: 0;
		}

		p {
			position: absolute;
			text-align: center;
			user-select: none;
		}
	}
</style>
