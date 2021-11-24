import create from 'zustand'

const states = (setStore) => ({
  selectedId: null,
  setSelectedId: (id) => setStore({ selectedId: id }),
})

const useTreeStore = create(states)

export default useTreeStore
