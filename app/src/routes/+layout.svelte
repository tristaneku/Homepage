<script lang="ts">
	import favicon from '#lib/assets/favicon.png';
	import { onMount } from 'svelte';
	import type { LayoutProps } from './$types';
	import { setupI18n } from '#lib/i8n/service.ts';
	import { isLoading } from 'svelte-i18n';
	import { lenis } from '#lib/lenis.svelte.ts';

	setupI18n();

	onMount(() => lenis.init());

	let { children }: LayoutProps = $props();
</script>

<svelte:head>
	<meta name="theme-color" content="#f3f3e2" />
	<link rel="icon" href={favicon} />
	<title>Tristan</title>
</svelte:head>

{#if !$isLoading}
	{@render children()}
{/if}

<style>
	@import url('https://fonts.googleapis.com/css2?family=Geist:ital,wght@0,100..900;1,100..900&display=swap');

	:global(:root) {
		--cw: #f3f3e2;
		--cb: #73c1e8;
		--cy: #ebebad;
		color-scheme: light dark;
	}

	:global(*) {
		margin: 0;
		padding: 0;
		outline: none;
		border: none;
		background: none;
		box-sizing: border-box;
		text-decoration: none;
	}

	:global(body) {
		display: flex;
		flex-direction: column;
		width: 100%;
		background: var(--cw);
		color: var(--cb);
		font-family: 'Geist', sans-serif;
	}

	:global(html) {
		scrollbar-width: none;
	}

	:global(html)::-webkit-scrollbar {
		display: none;
	}
</style>
