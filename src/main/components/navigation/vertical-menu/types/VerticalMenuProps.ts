// --- VerticalMenuProps -------------------------------------------------

type VerticalMenuProps = {
  activeItemId?: string,
  collapsible?: boolean,
  items?: (Item | Menu)[]
}

type Item = {
  type: 'item',
  text: string,
  id: string,
}

type Menu = {
  type: 'menu'
  text?: string,
  menuId?: string,
  items?: (Item | Menu)[]  
}

// --- exports ------------------------------------------------------

export default VerticalMenuProps
