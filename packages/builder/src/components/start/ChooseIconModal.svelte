<script>
  import {
    ModalContent,
    Icon,
    ColorPicker,
    Label,
    notifications,
  } from "@budibase/bbui"
  import { appsStore } from "stores/portal"
  import { createEventDispatcher } from "svelte"

  export let app
  export let name
  export let color
  export let autoSave = false

  const dispatch = createEventDispatcher()

  let iconsList = [
    "Apps",
    "animation",
    "interaction",
    "text-numbers",
    "Apps-all",
    "briefcase",
    "shopping-cart",
    "radio-button",
    "Help-circle",
    "Project",
    "buildings",
    "search",
    "promote",
    "camera",
    "bug",
    "channel",
    "calendar",
    "check-box",
    "clock",
    "collection",
    "comment",
    "community",
    "data",
    "email",
    "emoji",
    "file",
    "filmstrip",
    "flag",
    "heart",
    "image",
    "lightbulb",
    "lighten",
    "logo",
    "pattern",
    "publish",
    "ribbon",
    "social-network",
    "stamp-clone",
    "star",
    "table",
    "template",
    "web-page",
  ]

  const save = async () => {
    if (!autoSave) {
      dispatch("change", { color, name })
      return
    }
    try {
      await appsStore.save(app.instance._id, {
        icon: { name, color },
      })
    } catch (error) {
      notifications.error("Error updating app")
    }
  }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<ModalContent title="Edit Icon" confirmText="Save" onConfirm={save}>
  <div class="color-selection">
    <div>
      <Label size="XL">Select a color</Label>
    </div>
    <div class="color-selection-item">
      <ColorPicker bind:value={color} on:change={e => (color = e.detail)} />
    </div>
  </div>
  <div class="scrollable-icons">
    <div class="title-spacing">
      <Label size="XL">Select an icon</Label>
    </div>
    <div class="grid">
      {#each iconsList as item}
        <div
          class="icon-item"
          class:selected={item === name}
          on:click={() => (name = item)}
        >
          <Icon name={item} {color} size="XL" />
        </div>
      {/each}
    </div>
  </div>
</ModalContent>

<style>
  .scrollable-icons {
    overflow-y: auto;
    height: auto;
  }

  .grid {
    display: grid;
    grid-gap: 10px;
    grid-template-columns: repeat(7, 1fr);
  }

  .color-selection {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
  }

  .color-selection-item {
    margin-left: 12px;
  }

  .title-spacing {
    margin-bottom: 12px;
  }

  .icon-item {
    cursor: pointer;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: 6px;
    border-radius: 8px;
    border: 1px solid transparent;
  }
  .icon-item.selected {
    background-color: var(--spectrum-global-color-gray-200);
    border: 1px solid var(--spectrum-global-color-gray-300);
  }
</style>
