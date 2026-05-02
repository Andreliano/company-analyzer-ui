<script setup>
/* Imports */
import {
  ref,
  computed,
} from 'vue';
import { useRoute } from 'vue-router';
import HamburgerMenu from './HamburgerMenu.vue';

/* Route */
const route = useRoute();

/* State */
const state = ref({
  menuOpen: false,
  menuItems: [
    {
      name: 'marketDataView',
      label: 'Market Data View',
      icon: 'pi pi-chart-bar',
    },
    {
      label: 'Company Research',
      icon: 'pi pi-search',
      children: [
        {
          name: 'companyScreenerView',
          label: 'Company Screener',
          icon: 'pi pi-filter',
        },
        {
          name: 'companyProfileView',
          label: 'Company Profile',
          icon: 'pi pi-id-card',
        },
      ],
    },
    {
      label: 'Sheet Studio',
      icon: 'pi pi-file-excel',
      children: [
        {
          name: 'singleSheetGeneratorView',
          label: 'Single Generator',
          icon: 'pi pi-file-edit',
        },
        {
          name: 'batchSheetRunnerView',
          label: 'Batch Runner',
          icon: 'pi pi-play-circle',
        },
      ],
    },
  ],
});

/* Handle open menu */
const openMenu = () => {
  state.value.menuOpen = true;
};

/* Handle close menu */
const closeMenu = () => {
  state.value.menuOpen = false;
};

/* Handle Drawer visibility */
const updateDrawerVisibility = (value) => {
  state.value.menuOpen = value;
};

/* Handle link click */
const handleMenuLinkClick = (navigate) => {
  // Trigger navigation to the target route
  navigate();
  // Closes the menu after the link is clicked
  closeMenu();
};

/* Computed - Handle menu link classes */
const menuLinkClasses = computed(() => (menuItemName, isChild = false) => ({
  'drawer-menu__link': true,
  'drawer-menu__link--active': route?.name === menuItemName,
  'drawer-menu__link--child': isChild,
}));

/* Computed - Drawer menu style */
const drawerMenuStyle = computed(() => ({
  'min-width': '25rem',
}));
</script>

<template>
  <Drawer
    :visible="state.menuOpen"
    data-testid="drawer-menu"
    class="drawer-menu"
    :style="drawerMenuStyle"
    role="dialog"
    aria-label="Drawer Menu"
    @update:visible="updateDrawerVisibility"
  >
    <template #header>
      <Heading
        content="MENU"
        size="2"
        visual-size="3"
        text-align="left"
        data-testid="drawer-menu-heading"
        class="drawer-menu__heading"
      />
    </template>

    <ul
      class="drawer-menu__navigation"
      data-testid="drawer-menu-navigation"
    >
      <li
        v-for="menuItem in state.menuItems"
        :key="menuItem.label"
      >
        <!-- Grouped item (e.g., Admin Tools) -->
        <template v-if="menuItem.children">
          <div
            class="drawer-menu__group-label"
            data-testid="drawer-menu-group-label"
          >
            <span :class="menuItem.icon" />
            <span
              class="drawer-menu__group-label__text"
              data-testid="drawer-menu-group-label-text"
            >
              {{ menuItem.label }}
            </span>
          </div>
          <ul
            class="drawer-menu__group-children"
            data-testid="drawer-menu-group-children"
          >
            <li
              v-for="child in menuItem.children"
              :key="child.name"
              class="drawer-menu__group-children__list"
              :data-testid="`drawer-menu-group-children-item-${child.name}`"
            >
              <router-link
                v-slot="{ navigate }"
                :to="{ name: child.name }"
                custom
              >
                <a
                  :class="menuLinkClasses(child.name, true)"
                  tabindex="0"
                  :data-testid="`menu-link-child-${child.name}`"
                  @click="handleMenuLinkClick(navigate)"
                  @keydown.enter.prevent="handleMenuLinkClick(navigate)"
                >
                  <span :class="child.icon" />
                  <span
                    class="drawer-menu__link-text"
                    data-testid="drawer-menu-link-text-children"
                  >
                    <span
                      class="drawer-menu__link-label"
                      data-testid="drawer-menu-link-label-children"
                    >
                      {{ child.label }}
                    </span>
                  </span>
                </a>
              </router-link>
            </li>
          </ul>
        </template>

        <!-- Single item -->
        <template v-else>
          <router-link
            v-slot="{ navigate }"
            :to="{ name: menuItem.name }"
            custom
          >
            <a
              :class="menuLinkClasses(menuItem.name)"
              tabindex="0"
              :data-testid="`menu-link-single-${menuItem.name}`"
              @click="handleMenuLinkClick(navigate)"
              @keydown.enter.prevent="handleMenuLinkClick(navigate)"
            >
              <span :class="menuItem.icon" />
              <span
                class="drawer-menu__link-text"
                data-testid="drawer-menu-link-text-single"
              >
                <span
                  class="drawer-menu__link-label"
                  data-testid="drawer-menu-link-label-single"
                >
                  {{ menuItem.label }}
                </span>
              </span>
            </a>
          </router-link>
        </template>
      </li>
    </ul>
  </Drawer>

  <HamburgerMenu
    :menu-open="state.menuOpen"
    @open="openMenu"
  />
</template>

<style lang="scss" scoped>
$sidebar-bg: #1e293b;
$sidebar-text:  #cbd5e1;
$sidebar-text-muted:  #64748b;
$sidebar-hover-bg:    rgba(255, 255, 255, 0.07);
$sidebar-active-bg:   rgba(99, 102, 241, 0.18);
$sidebar-active-text: #818cf8;
$sidebar-border:      rgba(255, 255, 255, 0.08);

// Override PrimeVue Drawer
:deep(.p-drawer) {
  background-color: $sidebar-bg;
  border-right: 1px solid $sidebar-border;
}

:deep(.p-drawer-header) {
  background-color: $sidebar-bg;
  border-bottom: 1px solid $sidebar-border;
  padding: 1.25rem 1.5rem;
}

:deep(.p-drawer-close-button) {
  color: $sidebar-text-muted !important;

  &:hover {
    color: $sidebar-text !important;
    background-color: $sidebar-hover-bg !important;
  }
}

:deep(.p-drawer-content) {
  background-color: $sidebar-bg;
  padding: 0.5rem 0;
}

.drawer-menu {

  &__heading {
    margin-left: 0.5rem;
    font-size: $font-xl;
    font-weight: 700;
    color: #f1f5f9; // slate-100 — titlu MENU vizibil pe dark
  }

  &__group-label {
    display: flex;
    align-items: center;
    padding: 1.25rem 1.25rem 0.5rem;
    color: $sidebar-text-muted;
    font-size: $font-xs;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;

    &__text {
      padding-left: 0.625rem;
    }

    .pi {
      font-size: $font-sm;
    }
  }

  &__group-children {
    list-style-type: none;
    padding: 0 0 0.5rem 0;
    margin: 0;
  }

  &__navigation {
    list-style-type: none;
    padding: 0.5rem 0;
    margin: 0;

    > li {
      padding: 0.125rem 0.75rem;
      margin: 0;
    }

    a {
      display: flex;
      align-items: center;
      padding: 0.875rem 1rem;
      text-decoration: none;
      cursor: pointer;
      color: $sidebar-text;
      border-radius: 0.5rem;
      font-size: $font-base; // Marit la 1rem
      font-weight: 500;
      transition: background-color 0.15s ease, color 0.15s ease;

      .pi {
        font-size: $font-base;
        color: $sidebar-text-muted;
        transition: color 0.15s ease;
        flex-shrink: 0;
      }

      &:hover {
        background-color: $sidebar-hover-bg;
        color: #f1f5f9;

        .pi {
          color: $sidebar-text;
        }
      }
    }

    .drawer-menu__link--active {
      background-color: $sidebar-active-bg;
      color: $sidebar-active-text;
      font-weight: 600;

      .pi {
        color: $sidebar-active-text;
      }

      position: relative;
      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 3px;
        height: 60%;
        background-color: $sidebar-active-text;
        border-radius: 0 2px 2px 0;
      }
    }

    .drawer-menu__link--child {
      padding-left: 1.5rem;
    }
  }

  &__link-label {
    margin-left: 1rem;
    font-size: $font-base;
  }
}
</style>
