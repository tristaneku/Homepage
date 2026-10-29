<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		children: Snippet;
	}

	let { children, ...props }: Props = $props();

	let section: HTMLDivElement;

	let scrollY = $state(0);
	let innerHeight = $state(0);

	let opacity = $state(0);
	let blur = $state(0);

	$effect(() => {
		scrollY;

		const distance = Math.abs(section.getBoundingClientRect().top);

		opacity = Math.max(0, 1 - (distance / innerHeight) * 2);
		blur = Math.max(0, (distance / innerHeight) * 4);
	});
</script>

<svelte:window bind:scrollY bind:innerHeight />

<div bind:this={section} style:opacity style:filter="blur({blur}px)" class="section" {...props}>
	{@render children()}
</div>

<style>
	.section {
		height: 100dvh;
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 12px;
	}
</style>
