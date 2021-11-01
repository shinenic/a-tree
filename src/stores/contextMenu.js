import create from 'zustand'

const states = (set) => ({
  isContextMenuOpened: false,
  clickedTreeNode: null,
  position: {
    mouseX: 0,
    mouseY: 0,
  },

  closeContextMenu: () => set({ isContextMenuOpened: false }),
  openContextMenu: (event, clickedTreeNode) => {
    set({
      isContextMenuOpened: true,
      clickedTreeNode,
      position: {
        mouseX: event.clientX - 2,
        mouseY: event.clientY - 4,
      },
    })
  },
})

const useContextMenu = create(states)

export default useContextMenu
