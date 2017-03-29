module.exports = class HemlockTrie {
  constructor (casesensitive = true) {
    this.casesensitive = casesensitive
    this._trie = {}
  }

  addWord (word) {
    const sanitizedWord = this.casesensitive ? word : word.toLowerCase()
    const charList = sanitizedWord.split('')
    this.addCharList(charList, this._trie)
  }
  removeWord (word) {
    const sanitizedWord = this.casesensitive ? word : word.toLowerCase()
    const charList = sanitizedWord.split('')
    const node = this.getNodeFromCharList(charList, this._trie)
    if (node === null || !node.termination) {
      throw new Error(`No such word: ${word}`)
    }
    this.processDeletionForCharList(charList, this._trie)
    return true
  }
  checkWord (word) {
    const sanitizedWord = this.casesensitive ? word : word.toLowerCase()
    const charList = sanitizedWord.split('')
    const node = this.getNodeFromCharList(charList, this._trie)
    if (node === null) return false
    if (node.termination) return true
    return false
  }
  checkPrefix (prefix) {
    const sanitizedWord = this.casesensitive ? prefix : prefix.toLowerCase()
    const charList = sanitizedWord.split('')
    const node = this.getNodeFromCharList(charList, this._trie)
    if (node === null) return false
    return true
  }
  getChildren (prefix) {
    const sanitizedWord = this.casesensitive ? prefix : prefix.toLowerCase()
    const charList = sanitizedWord.split('')
    const node = this.getNodeFromCharList(charList, this._trie)
    if (node === null) throw new Error(`No such prefix: ${prefix}`)
    return Object.keys(node).filter(key => key !== 'termination').sort()
  }
  addCharList (charList, node) {
    const head = charList[0]
    const tail = charList.slice(1)
    if (!node[head]) node[head] = {}
    if (tail.length < 1) return (node[head].termination = true)
    return this.addCharList(tail, node[head])
  }
  getNodeFromCharList (charList, node) {
    const head = charList[0]
    const tail = charList.slice(1)
    if (tail.length === 0) {
      return node[head] || null
    }
    if (!node[head]) return null
    return this.getNodeFromCharList(tail, node[head])
  }
  processDeletionForCharList (charList, node) {
    const head = charList[0]
    const tail = charList.slice(1)
    if (!head) {
      delete node.termination
      return Object.keys(node).length === 0
    }
    const canDelete = this.processDeletionForCharList(tail, node[head])
    if (canDelete) delete node[head]
    return Object.keys(node).length === 0
  }
}
