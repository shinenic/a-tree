export const getRawContent = async (node, token) => {
  // node from pull or commit tree
  if (node?.raw_url) {
    const response = await fetch(node.raw_url)
    const result = await response.text()

    return result
  }

  const nodeContentUrl = node?.url || node?.contents_url
  const response = await fetch(nodeContentUrl, {
    headers: {
      ...(token && { authorization: `token ${token}` }),
    },
  })
  const result = await response.json()

  return window.atob(result.content.replace('\n', ''))
}

export const checkIsFileNode = (node) => {
  if (!node) return false

  return node?.type === 'blob' || Boolean(node?.status)
}
