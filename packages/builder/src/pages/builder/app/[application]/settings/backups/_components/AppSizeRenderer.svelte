<script>
  import { Icon } from "@budibase/bbui"

  export let row

  $: automations = row?.automations
  $: datasources = row?.datasources
  $: screens = row?.screens
</script>

<div class="cell">
  {#if automations != null && screens != null && datasources != null}
    <div class="item">
      <Icon name="Data" />
      <div>{datasources || 0}</div>
    </div>
    <div class="item">
      <Icon name="web-page" />
      <div>{screens || 0}</div>
    </div>
    <div class="item">
      <Icon name="prototyping" />
      <div>{automations || 0}</div>
    </div>
  {/if}
</div>

<style>
  .cell {
    display: flex;
    flex-direction: row;
    gap: calc(var(--spacing-xl) * 2);
    align-items: center;
  }

  .item {
    display: flex;
    gap: var(--spacing-s);
    flex-direction: row;
  }
</style>
