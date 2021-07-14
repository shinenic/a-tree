import usePageInfo from 'hooks/usePageInfo'

function App() {
  const pageInfo = usePageInfo()
  console.log({ ...pageInfo })

  return <div />
}

export default App
