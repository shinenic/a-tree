import create from 'zustand'

const states = (set) => ({
  viewedFileMap: {},

  clearMap: () => set({ viewedFileMap: {} }),
  setFileStatus: (filePath, viewed = false) =>
    set((state) => ({
      viewedFileMap: {
        ...state.viewedFileMap,
        [filePath]: viewed,
      },
    })),
})

const useViewedFiles = create(states)

export default useViewedFiles
