<script lang="ts">
	import { _ } from 'svelte-i18n';
	import Github from '../links/github.svelte';
	import Twitter from '../links/twitter.svelte';
	import Section from '../section.svelte';
	import Snake from '../snake.svelte';
	import Email from '../links/email.svelte';
	import TipCarousel from '../tip-carousel.svelte';
	import { playing } from '#lib/states/playing.svelte.ts';

	let innerWidth = $state(0);

	$effect(() => {
		if (innerWidth <= 1024) playing.value = false;
	});
</script>

<svelte:window bind:innerWidth />

<Section>
	<div class="main" style:opacity={playing.value ? 0.3 : 1} style:z-index={playing.value ? 0 : 1}>
		<p class="name">{$_('name')}</p>

		<div class="links-row">
			<Github />
			<Twitter />
			<Email />
		</div>
	</div>

	{#if innerWidth > 1024 && !playing.value}
		<TipCarousel />
	{/if}

	{#if innerWidth > 1024}
		<Snake />
	{/if}
</Section>

<style>
	.main {
		display: flex;
		flex-direction: column;
		align-items: center;
		max-width: 80%;
		gap: 8px;
		transition: opacity 0.2s ease;
	}

	.name {
		font-size: 2rem;
		text-align: center;
		transition: all 1s ease;

		@starting-style {
			opacity: 0;
			transform: translateY(100%);
			filter: blur(8px);
		}
	}

	.links-row {
		display: flex;
		flex-direction: row;
		gap: 20px;

		transition: all 0.6s ease 1s;

		@starting-style {
			opacity: 0;
			transform: translateY(100%);
			filter: blur(8px);
		}
	}
</style>
