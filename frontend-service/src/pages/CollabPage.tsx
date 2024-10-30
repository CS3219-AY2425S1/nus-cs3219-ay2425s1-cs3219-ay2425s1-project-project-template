 /* import React, { useState, useEffect, useRef } from 'react'
import { Editor } from '@monaco-editor/react'
import { db } from '../firebase'
import { doc, onSnapshot, setDoc } from 'firebase/firestore'

const CollabEditor = ({ roomId, userId }) => {
  const [code, setCode] = useState('')
  const editorRef = useRef(null)

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'rooms', roomId), (snapshot) => {
      if (snapshot.exists()) {
        setCode(snapshot.data().code)
      } else {
        setDoc(doc(db, 'rooms', roomId), { code: '//Enter code here' })
      }
    })
    return () => unsubscribe()
  }, [roomId])

  const handleCodeChange = (value) => {
    setCode(value)
    setDoc(doc(db, 'rooms', roomId), { code: value })
  }

  return (
    <Editor
      height="90vh"
      language="javascript"
      theme="vs-dark"
      value={code}
      onChange={handleCodeChange}
    />
  )
}

export default CollabEditor

*/