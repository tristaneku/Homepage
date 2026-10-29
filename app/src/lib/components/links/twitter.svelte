<script lang="ts">
	import { _ } from 'svelte-i18n';
	import BaseLink from '../base-link.svelte';
	import avatar from '#lib/assets/me/avatar.png';
	import TwitterIcon from '../icons/twitter-icon.svelte';
</script>

<BaseLink url="https://twitter.com/tristaneku" label="Twitter">
	<div class="popover">
		<div class="profile">
			<img class="avatar" height="40" src={avatar} alt="Avatar" />

			<div class="details">
				<div class="head">
					<p>{$_('username')}</p>
					<TwitterIcon height="12" />
				</div>

				<div class="follow">
					<p>114 <span>{$_('follower')}</span></p>
					<p>297 <span>{$_('following')}</span></p>
				</div>
			</div>
		</div>

		<div class="posts">
			<p>{$_('has_not_posted')}</p>
		</div>
	</div>
</BaseLink>

<style>
	.popover {
		display: flex;
		flex-direction: column;
		background: light-dark(#fff, #000);
		padding: 12px;
		gap: 8px;
		color: light-dark(#000, #fff);

		.profile {
			display: flex;
			width: 100%;
			flex-direction: row;
			gap: 8px;

			.avatar {
				border-radius: 100%;
			}

			.details {
				display: flex;
				flex-direction: column;
				width: 100%;
				gap: 2px;

				.head {
					display: flex;
					flex-direction: row;
					align-items: center;
					justify-content: space-between;
				}

				.follow {
					display: flex;
					flex-direction: row;
					gap: 8px;

					p {
						font-size: 0.8rem;

						span {
							color: light-dark(#536471, #71767b);
						}
					}
				}
			}
		}

		.posts {
			display: flex;
			justify-content: center;
			align-items: center;
			padding: 12px;

			p {
				font-size: 0.9rem;
			}
		}
	}
</style>
