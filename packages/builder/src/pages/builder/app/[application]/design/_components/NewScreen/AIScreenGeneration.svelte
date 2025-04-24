<script lang="ts">
  import { API } from "@/api"
  import AiInput from "@/components/common/ai/AIInput.svelte"
  import { auth, licensing } from "@/stores/portal"

  import { ActionButton, notifications } from "@budibase/bbui"
  import { url } from "@roxi/routify"

  let promptText = ""

  $: isEnabled = $auth?.user?.llm && !$licensing.aiCreditsExceeded

  async function submitPrompt(message: string) {
    const result = await API.generateScreen({ prompt: message })
    notifications.success("Screen created successfully!")

    window.location.pathname = $url(
      `../${result.screenId}/${result.screenId}-screen`
    )
  }

  const examplePrompts = [
    "Create me a basic registry form",
    "Create me a form for the courses table",
  ]
</script>

<div class="ai-generation">
  <div class="ai-generation-prompt">
    <AiInput
      bind:value={promptText}
      placeholder="Generate screens using AI..."
      onSubmit={submitPrompt}
      expandedOnly
    />
  </div>
  <div class="ai-generation-examples">
    {#if isEnabled}
      {#each examplePrompts as prompt}
        <ActionButton on:click={() => (promptText = prompt)}
          >{prompt}</ActionButton
        >
      {/each}
    {/if}
  </div>
</div>

<style>
  .ai-generation {
    margin-bottom: 24px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .ai-generation-examples {
    display: grid;
    gap: 10px;
  }

  @media (min-width: 833px) {
    .ai-generation-examples {
      grid-auto-flow: column;
    }
  }
  .ai-generation :global(.spectrum-Textfield-input),
  .ai-generation :global(.spectrum-ActionButton) {
    background: #1d1d1d;
    border-radius: 20px;
  }
</style>
