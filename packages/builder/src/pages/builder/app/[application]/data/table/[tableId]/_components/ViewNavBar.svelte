<script>
  import {
    tables,
    datasources,
    userSelectedResourceMap,
    contextMenuStore,
    appStore,
  } from "stores/builder"
  import IntegrationIcon from "components/backend/DatasourceNavigator/IntegrationIcon.svelte"
  import { Icon, ActionButton, ActionMenu, MenuItem } from "@budibase/bbui"
  import { params, url } from "@roxi/routify"
  import EditViewModal from "./EditViewModal.svelte"
  import DeleteViewModal from "./DeleteViewModal.svelte"
  import EditTableModal from "components/backend/TableNavigator/TableNavItem/EditModal.svelte"
  import DeleteTableModal from "components/backend/TableNavigator/TableNavItem/DeleteConfirmationModal.svelte"
  import { UserAvatars } from "@budibase/frontend-core"
  import { DB_TYPE_EXTERNAL } from "constants/backend"
  import { TableNames } from "constants"
  import { alphabetical } from "components/backend/TableNavigator/utils"
  import { tick, onDestroy } from "svelte"
  import { derived } from "svelte/store"
  import CreateViewButton from "./CreateViewButton.svelte"

  // View overflow
  let observer
  let viewContainer
  let viewVisibiltyMap = {}
  let overflowMenu

  // Editing table
  let editTableModal
  let deleteTableModal

  // Editing views
  let editableView
  let editViewModal
  let deleteViewModal

  $: tableId = $params.tableId
  $: table = $tables.list.find(table => table._id === tableId)
  $: datasource = $datasources.list.find(ds => ds._id === table?.sourceId)
  $: tableSelectedBy = $userSelectedResourceMap[table?._id]
  $: tableEditable = table?._id !== TableNames.USERS
  $: activeId = decodeURIComponent(
    $params.viewName ?? $params.viewId ?? $params.tableId
  )
  $: views = Object.values(table?.views || {})
    .filter(x => x.version === 2)
    .slice()
    .sort(alphabetical)
  $: v1Views = Object.values(table?.views || {})
    .filter(x => x.version !== 2)
    .slice()
    .sort(alphabetical)
  $: setUpObserver(views)
  $: hasViews = v1Views.length || views.length

  $: overflowedViews = views.filter(view => !viewVisibiltyMap[view.id])
  $: viewHidden = viewVisibiltyMap[activeId] === false

  const viewUrl = derived([url, params], ([$url, $params]) => viewId => {
    return $url(`../${$params.tableId}/${encodeURIComponent(viewId)}`)
  })

  const viewV1Url = derived([url, params], ([$url, $params]) => viewName => {
    return $url(`../${$params.tableId}/v1/${encodeURIComponent(viewName)}`)
  })

  const tableUrl = derived(url, $url => tableId => $url(`../${tableId}`))

  const openTableContextMenu = e => {
    if (!tableEditable) {
      return
    }
    e.preventDefault()
    e.stopPropagation()
    contextMenuStore.open(
      table._id,
      [
        {
          icon: "edit",
          name: "Edit",
          keyBind: null,
          visible: table?.sourceType !== DB_TYPE_EXTERNAL,
          disabled: false,
          callback: editTableModal?.show,
        },
        {
          icon: "Delete",
          name: "Delete",
          keyBind: null,
          visible: true,
          disabled: false,
          callback: deleteTableModal?.show,
        },
      ],
      {
        x: e.clientX,
        y: e.clientY,
      }
    )
  }

  const openViewContextMenu = async (e, view) => {
    e.preventDefault()
    e.stopPropagation()
    editableView = view
    await tick()
    contextMenuStore.open(
      view.id,
      [
        {
          icon: "edit",
          name: "Edit",
          keyBind: null,
          visible: true,
          disabled: false,
          callback: editViewModal?.show,
        },
        {
          icon: "Delete",
          name: "Delete",
          keyBind: null,
          visible: true,
          disabled: false,
          callback: deleteViewModal?.show,
        },
      ],
      {
        x: e.clientX,
        y: e.clientY,
      }
    )
  }

  const editOverflowView = async view => {
    editableView = view
    await tick()
    editViewModal?.show()
  }

  const deleteOverflowView = async view => {
    editableView = view
    await tick()
    deleteViewModal?.show()
  }

  const setUpObserver = async views => {
    observer?.disconnect()
    if (!views.length) {
      return
    }
    await tick()
    observer = new IntersectionObserver(
      entries => {
        let updates = {}
        for (let entry of entries) {
          updates[entry.target.dataset.id] = entry.isIntersecting
        }
        viewVisibiltyMap = {
          ...viewVisibiltyMap,
          ...updates,
        }
      },
      {
        threshold: 1,
        root: viewContainer,
      }
    )
    for (let child of viewContainer.children) {
      if (child.dataset.id) {
        observer.observe(child)
      }
    }
  }

  onDestroy(() => {
    observer?.disconnect()
  })
</script>

<div class="nav">
  <a
    class="datasource-icon"
    href={`/builder/app/${$appStore.appId}/data/datasource/${datasource?._id}`}
  >
    <IntegrationIcon
      integrationType={datasource?.source}
      schema={datasource?.schema}
      size="24"
    />
  </a>
  <a
    href={$tableUrl(tableId)}
    class="nav-item"
    class:active={tableId === activeId}
    on:contextmenu={openTableContextMenu}
  >
    <div class="nav-item__title">
      {table?._id === TableNames.USERS ? "App users" : table?.name || ""}
    </div>
    {#if tableSelectedBy}
      <UserAvatars size="XS" users={tableSelectedBy} />
    {/if}
    {#if tableEditable}
      <Icon
        on:click={openTableContextMenu}
        hoverable
        name="more"
        color="var(--spectrum-global-color-gray-600)"
        hoverColor="var(--spectrum-global-color-gray-900)"
      />
    {/if}
  </a>
  {#if hasViews}
    <div class="nav__views" bind:this={viewContainer}>
      {#each v1Views as view (view.name)}
        {@const selectedBy = $userSelectedResourceMap[view.name]}
        <a
          href={$viewV1Url(view.name)}
          class="nav-item"
          class:active={view.name === activeId}
          on:contextmenu={e => openViewContextMenu(e, view)}
          data-id={view.name}
        >
          <div class="nav-item__title">
            {view.name}
          </div>
          {#if selectedBy}
            <UserAvatars size="XS" users={selectedBy} />
          {/if}
          <Icon
            on:click={e => openViewContextMenu(e, view)}
            hoverable
            name="more"
            color="var(--spectrum-global-color-gray-600)"
            hoverColor="var(--spectrum-global-color-gray-900)"
          />
        </a>
      {/each}
      {#each views as view (view.id)}
        {@const selectedBy = $userSelectedResourceMap[view.id]}
        <a
          href={$viewUrl(view.id)}
          class="nav-item"
          class:active={view.id === activeId}
          class:hidden={!viewVisibiltyMap[view.id]}
          on:contextmenu={e => openViewContextMenu(e, view)}
          data-id={view.id}
        >
          <svg
            class="spectrum-Icon spectrum-Icon--sizeM"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            focusable="false"
            aria-label="Table"
          >
            <path
              d="M15.75,2H4.25c-1.24072,0-2.25,1.00977-2.25,2.25v11.5c0,1.24023,1.00928,2.25,2.25,2.25h11.5c1.24072,0,2.25-1.00977,2.25-2.25V4.25c0-1.24023-1.00928-2.25-2.25-2.25ZM3.5,9h3v3h-3v-3ZM8,9h8.5v3h-8.5v-3ZM3.5,4.25c0-.41309.33643-.75.75-.75h11.5c.41357,0,.75.33691.75.75v3.25H3.5v-3.25ZM3.5,15.75v-2.25h3v3h-2.25c-.41357,0-.75-.33691-.75-.75ZM16.5,15.75c0,.41309-.33643.75-.75.75h-7.75v-3h8.5v2.25Z"
              fill="var(--iconFill, currentColor)"
              stroke-width="0"
            />
          </svg>
          <div class="nav-item__title">
            {view.name}
          </div>
          {#if selectedBy}
            <UserAvatars size="XS" users={selectedBy} />
          {/if}
          <Icon
            on:click={e => openViewContextMenu(e, view)}
            hoverable
            name="more"
            color="var(--spectrum-global-color-gray-600)"
            hoverColor="var(--spectrum-global-color-gray-900)"
          />
        </a>
      {/each}
    </div>
  {/if}
  {#if !hasViews && tableEditable}
    <CreateViewButton firstView {table} />
    <span>
      To create subsets of data, control access and more, create a view.
    </span>
  {/if}
  {#if overflowedViews.length}
    <ActionMenu align="right" bind:this={overflowMenu}>
      <div slot="control" let:open>
        <ActionButton
          icon="chevron-down-size300"
          quiet
          selected={open || viewHidden}
        >
          {overflowedViews.length} more
        </ActionButton>
      </div>
      {#each overflowedViews as view}
        <ActionMenu
          align="left-context-menu"
          openOnHover
          animate={false}
          offset={-4}
        >
          <div slot="control">
            <a
              href={$viewUrl(view.id)}
              class="nav-overflow-item"
              class:active={view.id === activeId}
              on:click={overflowMenu?.hide}
            >
              <MenuItem icon={viewHidden ? "Checkmark" : null}>
                {view.name}
                <Icon slot="right" name="chevron-right" />
              </MenuItem>
            </a>
          </div>
          <MenuItem icon="edit" on:click={() => editOverflowView(view)}>
            Edit
          </MenuItem>
          <MenuItem icon="Delete" on:click={() => deleteOverflowView(view)}>
            Delete
          </MenuItem>
        </ActionMenu>
      {/each}
    </ActionMenu>
  {/if}
  {#if hasViews}
    <CreateViewButton firstView={false} {table} />
  {/if}
</div>

{#if table && tableEditable}
  <EditTableModal {table} bind:this={editTableModal} />
  <DeleteTableModal {table} bind:this={deleteTableModal} />
{/if}

{#if editableView}
  <EditViewModal view={editableView} bind:this={editViewModal} />
  <DeleteViewModal view={editableView} bind:this={deleteViewModal} />
{/if}

<style>
  /* Main containers */
  .nav {
    height: 48px;
    border-bottom: var(--border-light);
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    padding: 0 var(--spacing-xl);
    gap: 8px;
    background: var(--background);
  }
  .nav-icon {
    display: flex;
  }
  .nav__views {
    height: 48px;
    flex: 0 1 auto;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    overflow: hidden;
    align-items: center;
    gap: 8px;
    transform: translateZ(0);
  }

  /* Table and view items */
  .nav-item {
    padding: 0 8px;
    height: 28px;
    border-radius: 8px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: var(--spacing-s);
    transition: background 130ms ease-out, color 130ms ease-out;
    color: var(--spectrum-global-color-gray-600);
    position: relative;
    font-size: 15px;
  }
  .nav-item.hidden {
    visibility: hidden;
  }
  .nav-item.active,
  .nav-item:hover {
    background: var(--spectrum-global-color-gray-200);
    cursor: pointer;
    color: var(--spectrum-global-color-gray-900);
    box-shadow: var(--spectrum-global-color-gray-300) 0px 0px 0px 1px inset;
  }
  .nav-item.active::after {
    content: "";
    display: block;
    width: 100%;
    height: 1px;
    border-radius: 2px;
    background: var(--spectrum-global-color-gray-800);
    position: absolute;
    bottom: -10px;
    left: 0px;
    z-index: 2;
  }

  .nav-item:not(.active) :global(.icon) {
    display: none;
  }
  .nav-item__title {
    max-width: 150px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  /* OVerflow items */
  .nav-overflow-item:not(.active) :global(> .spectrum-Menu-item > .icon) {
    visibility: hidden;
  }
  .datasource-icon {
    height: 24px;
  }
</style>
