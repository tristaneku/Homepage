<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import { cubicOut } from 'svelte/easing';

	interface Props {
		url?: string;
		label: string;
		popover?: boolean;
		children?: Snippet;
	}

	const { url, label, popover = true, children }: Props = $props();

	let showPopover = $state(false);

	let timeout: ReturnType<typeof setTimeout>;

	function onMouseEnter() {
		clearTimeout(timeout);
		timeout = setTimeout(() => (showPopover = true), 200);
	}

	function onMouseLeave() {
		showPopover = false;
		clearTimeout(timeout);
	}

	function flyIn(node: Element) {
		return {
			duration: 300,
			easing: cubicOut,
			css: (t: number) => `opacity: ${t}; transform: translate(-50%, ${8 + 8 * t}px) scale(${0.9 + 0.1 * t});`
		};
	}

	onMount(() => () => clearTimeout(timeout));
</script>

<div class="link">
	<a href={url} onmouseenter={onMouseEnter} onmouseleave={onMouseLeave}>{label}</a>

	{#if popover && showPopover}
		<div class="popover" transition:flyIn>
			{#if children}
				{@render children()}
			{/if}
		</div>
	{/if}
</div>

<style>
	.link {
		position: relative;
	}

	a {
		display: inline-block;
		color: var(--cb);
		transition: transform 0.2s ease;
		cursor: pointer;
	}

	a:hover {
		transform: scale(1.2);
	}

	.popover {
		position: absolute;
		left: 50%;
		transform: translate(-50%, 16px);
		white-space: nowrap;
		border-radius: 12px;
		overflow: hidden;
	}
</style>
