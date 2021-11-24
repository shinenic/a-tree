import { isEmpty, compact, get, set } from 'lodash'

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

export const generateTree = (tree, mergeProxyNode = true) => {
  const objTree = tree.reduce((result, node) => {
    const originalPath = node.path || node.filename
    const pathArray = originalPath.split('/')
    const path = pathArray.join('/children/').split('/')

    if (!get(result, path)) {
      return set(result, path, node)
    }

    return result
  }, {})

  const folderNodeIds = []
  setNodeIds(objTree, null, folderNodeIds, mergeProxyNode)

  return [objTree, folderNodeIds]
}

const isProxyNode = (node) => {
  const hasChildNoSiblings = Object.keys(node.children).length === 1

  if (!hasChildNoSiblings) return false

  const childKey = Object.keys(node.children)[0]
  const child = node.children[childKey]
  const isChildLeaf = isEmpty(child.children)

  return !isChildLeaf
}

const setNodeIds = (tree, parentNodeId = '', folderNodeIds, mergeProxyNode) => {
  return Object.keys(tree).map((key) => {
    let node = tree[key]
    let label = key

    const hasChildren = !isEmpty(node.children)
    let id = compact([parentNodeId, key]).join('/')

    node.id = id

    if (hasChildren) {
      while (isProxyNode(node) && mergeProxyNode) {
        const childKey = Object.keys(node.children)[0]
        const child = node.children[childKey]

        delete tree[label]

        label = `${label}/${childKey}`

        tree[label] = child
        node = tree[label]

        id = compact([parentNodeId, label]).join('/')
        node.id = id
      }

      folderNodeIds.push(id)
      return setNodeIds(node.children, id, folderNodeIds, mergeProxyNode)
    }

    return id
  })
}
