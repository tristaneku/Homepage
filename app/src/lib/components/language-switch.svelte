<script lang="ts">
	import { playing } from '#lib/states/playing.svelte.ts';
	import { locale } from 'svelte-i18n';

	const position = $derived($locale == 'en' ? 0 : 32);

	let scrollY = $state(0);
	let innerHeight = $state(0);

	let offset = $derived(scrollY % innerHeight);
	let distance = $derived(Math.min(offset, innerHeight - offset));
	let visibleRatio = $derived(1 - distance / innerHeight);
	let opacity = $derived(Math.min(1, Math.max(0, (visibleRatio - 0.8) / 0.2)));
</script>

<svelte:window bind:scrollY bind:innerHeight />

{#if !playing.value}
	<div class="bar" style:opacity>
		<div class="switch">
			<span class="background" style:left="{position}px"></span>

			<button onclick={() => locale.set('en')} disabled={$locale == 'en'}>EN</button>
			<button onclick={() => locale.set('de')} disabled={$locale == 'de'}>DE</button>
		</div>
	</div>
{/if}

<style>
	.bar {
		position: fixed;
		z-index: 50;
		top: 0;
		left: 0;
		padding: 20px;
	}

	.switch {
		position: relative;
		display: flex;
		gap: 4px;
		transition: opacity 0.6s ease 1s;

		@starting-style {
			opacity: 0;
		}

		button {
			position: relative;
			z-index: 1;
			height: 28px;
			width: 28px;
			color: var(--cb);
			user-select: none;
			transition: all 0.2s ease;
		}

		button:disabled {
			color: white;
		}

		button:not(:disabled) {
			cursor: pointer;
		}

		button:not(:disabled):hover {
			transform: scale(0.8);
		}

		.background {
			position: absolute;
			top: 0;
			height: 28px;
			width: 28px;
			background: var(--cb);
			transition: all 0.2s ease;
		}
	}
</style>
