<script>
  import { ActionGroup, ActionButton } from "@budibase/bbui"
  import { previewStore } from "stores/builder"
</script>

<ActionGroup compact>
  <ActionButton
    quiet
    icon="device-desktop"
    selected={$previewStore.previewDevice === "desktop"}
    on:click={() => previewStore.setDevice("desktop")}
  />
  <ActionButton
    quiet
    icon="device-tablet"
    selected={$previewStore.previewDevice === "tablet"}
    on:click={() => previewStore.setDevice("tablet")}
  />
  <ActionButton
    quiet
    icon="device-phone"
    selected={$previewStore.previewDevice === "mobile"}
    on:click={() => previewStore.setDevice("mobile")}
  />
</ActionGroup>
